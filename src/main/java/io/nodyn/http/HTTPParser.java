package io.nodyn.http;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.CompositeByteBuf;
import io.netty.buffer.Unpooled;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;

import java.nio.charset.Charset;
import java.util.*;

/**
 * @author Bob McWhirter
 */
public class HTTPParser extends EventSource {

    public static final String[] METHODS = new String[]{
            "DELETE",
            "GET",
            "HEAD",
            "POST",
            "PUT",
            "CONNECT",
            "OPTIONS",
            "TRACE",
            "COPY",
            "LOCK",
            "MKCOL",
            "MOVE",
            "PROPFIND",
            "PROPPATCH",
            "SEARCH",
            "UNLOCK",
            "REPORT",
            "MKACTIVITY",
            "CHECKOUT",
            "MERGE",
            "MSEARCH",
            "NOTIFY",
            "SUBSCRIBE",
            "UNSUBSCRIBE",
            "PATCH",
            "PURGE",
    };

    public static enum Error {
        INVALID_EOF_STATE("stream ended at an unexpected time"),
        HEADER_OVERFLOW("too many header bytes seen; overflow detected"),
        CLOSED_CONNECTION("data received after completed connection: close message"),
        INVALID_VERSION("invalid HTTP version"),
        INVALID_STATUS("invalid HTTP status code"),
        INVALID_METHOD("invalid HTTP method"),
        INVALID_URL("invalid URL"),
        INVALID_HOST("invalid host"),
        INVALID_PORT("invalid port"),
        INVALID_PATH("invalid path"),
        INVALID_QUERY_STRING("invalid query string"),
        INVALID_FRAGMENT("invalid fragment"),
        LF_EXPECTED("LF character expected"),
        INVALID_HEADER_TOKEN("invalid character in header"),
        INVALID_CONTENT_LENGTH("invalid character in content-length header"),
        INVALID_CHUNK_SIZE("invalid character in chunk size header"),
        INVALID_CONSTANT("invalid constant string"),
        INVALID_INTERNAL_STATE("encountered unexpected internal state"),
        STRICT("strict mode assertion failed"),
        PAUSED("parser is paused"),
        UNKNOWN("an unknown error occurred");

        private String text;

        Error(String text) {
            this.text = text;
        }

    }

    private static final Charset UTF8 = Charset.forName("utf8");

    private static enum State {
        REQUEST,
        RESPONSE,
        HEADERS,
        BODY,
        TRAILERS,

        CHUNK_START,
        CHUNK_BODY,
        CHUNK_END,
    }

    public static final int REQUEST = 1;
    public static final int RESPONSE = 2;

    private int type;
    private State state;
    private Error error;

    private CompositeByteBuf buf;

    // common
    private String url;
    private int versionMajor;
    private int versionMinor;
    private Boolean shouldKeepAlive;

    // server
    private Integer method;

    // client
    private int statusCode;
    private String statusMessage;
    private boolean upgrade;

    private boolean chunked;
    private boolean skipBody;
    private int length;

    private List<String> headers = new ArrayList<>();
    private List<String> trailers = new ArrayList<>();

    private Set<String> expectedTrailers = new HashSet<>();


    public HTTPParser() {
        this.buf = Unpooled.compositeBuffer();
    }

    public String type() {
        if ( this.type == REQUEST ) {
            return "*** REQUEST";
        } else if ( this.type == RESPONSE ) {
            return "*** RESPONSE";
        }

        return "UNKNOWN";
    }

    public void reinitialize(int type) {
        this.type = type;
        if (this.type == REQUEST) {
            this.state = State.REQUEST;
        } else {
            this.state = State.RESPONSE;
        }
        this.buf.clear();
        this.method = null;
        this.url = null;
        this.versionMajor = 0;
        this.versionMinor = 0;
        this.headers.clear();
        this.trailers.clear();
        this.expectedTrailers.clear();
        this.shouldKeepAlive = null;

        this.chunked = false;
        this.skipBody = false;
        this.length = Integer.MAX_VALUE;

        this.statusCode = 0;
        this.statusMessage = "";

        this.upgrade = false;
    }

    public Integer getMethod() {
        return this.method;
    }

    public String getUrl() {
        return this.url;
    }

    public int getVersionMajor() {
        return this.versionMajor;
    }

    public int getVersionMinor() {
        return this.versionMinor;
    }

    public int getStatusCode() {
        return this.statusCode;
    }

    public String getStatusMessage() {
        return this.statusMessage;
    }

    public boolean getUpgrade() {
        return this.upgrade;
    }

    public String[] getHeaders() {
        return (String[]) this.headers.toArray(new String[this.headers.size()]);
    }

    public String[] getTrailers() {
        return (String[]) this.trailers.toArray(new String[this.headers.size()]);
    }

    public boolean getShouldKeepAlive() {
        if (this.versionMajor == 1 && this.versionMinor == 1) {
            if (this.shouldKeepAlive == null) {
                return true;
            }
            return this.shouldKeepAlive;
        } else {
            return false;
        }
    }

    public void setError(Error error) {
        System.err.println("!! " + error);
        this.error = error;
    }

    public Error getError() {
        return this.error;
    }

    protected boolean needsEof() {
        if (this.type == REQUEST) {
            return false;
        }

        if (((int) (this.statusCode / 100) == 1) ||
                this.statusCode == 204 ||
                this.statusCode == 304 ||
                this.skipBody) {
            return false;
        }

        if ( this.chunked || this.length != Integer.MAX_VALUE ) {
            return false;
        }

        return true;

    }

    public int execute(ByteBuf buf) {
        if (buf.readableBytes() == 0 && needsEof()) {
            finish();
        }

        addBuffer(buf);
        int startingLength = this.buf.readableBytes();

        LOOP:
        while (this.buf.readableBytes() > 0) {
            switch (this.state) {
                case REQUEST:
                    if (!readRequestLine()) {
                        break LOOP;
                    }
                    this.state = State.HEADERS;
                    continue LOOP;
                case RESPONSE:
                    if (!readStatusLine()) {
                        break LOOP;
                    }
                    this.state = State.HEADERS;
                    continue LOOP;
                case HEADERS:
                    int headerResult = readHeaders();
                    if (headerResult == 0) {
                        Object result = emit("headersComplete", CallbackResult.EMPTY_SUCCESS);
                        this.state = State.BODY;
                        if (result instanceof Boolean && ((Boolean) result).booleanValue()) {
                            this.skipBody = true;
                        }
                        if ( this.skipBody ) {
                            finish();
                            break LOOP;
                        } else {
                            if ( this.chunked ) {
                                this.state = State.BODY;
                                continue LOOP;
                            } else if (this.length == 0) {
                                finish();
                                break LOOP;
                            } else if (this.length != Integer.MAX_VALUE) {
                                this.state = State.BODY;
                            } else {
                                if ( this.type == REQUEST || ! needsEof() ) {
                                    finish();
                                    break LOOP;
                                } else {
                                    this.state = State.BODY;
                                }
                            }
                        }
                        continue LOOP;
                    }
                    break LOOP;
                case BODY:
                    if (this.chunked) {
                        this.state = State.CHUNK_START;
                        continue LOOP;
                    }
                    ByteBuf body = readBody();
                    emit("body", CallbackResult.createSuccess(body));
                    if ( this.length == 0 ) {
                        finish();
                        break LOOP;
                    }
                    continue LOOP;
                case CHUNK_START:
                    if (!readChunkStart()) {
                        break LOOP;
                    }
                    if (this.length == 0) {
                        this.state = State.TRAILERS;
                    } else {
                        this.state = State.CHUNK_BODY;
                    }
                    continue LOOP;
                case CHUNK_BODY:
                    ByteBuf chunkBody = readBody();
                    emit("body", CallbackResult.createSuccess(chunkBody));
                    if (this.length == 0) {
                        this.state = State.CHUNK_END;
                    }
                    continue LOOP;
                case CHUNK_END:
                    if (!readChunkEnd()) {
                        break LOOP;
                    }
                    this.state = State.CHUNK_START;
                    continue LOOP;
                case TRAILERS:
                    int trailerResult = readTrailers();
                    if (trailerResult == 0) {
                        finish();
                    }
                    break LOOP;
            }
        }

        if (this.error != null) {
            return -1 * this.error.ordinal();
        }

        int endingLength = this.buf.readableBytes();
        int numRead = startingLength - endingLength;
        return numRead;
    }

    void addBuffer(ByteBuf buf) {
        this.buf.writeBytes(buf);
        //this.buf.addComponent( buf );
    }

    int readableBytes() {
        return this.buf.readableBytes();
    }

    int readerIndex() {
        return this.buf.readerIndex();
    }

    protected ByteBuf readLine() {
        int cr = buf.indexOf(readerIndex(), readerIndex() + readableBytes(), (byte) '\r');
        if (cr < 0) {
            return null;
        }

        if (buf.getByte(cr + 1) != '\n') {
            return null;
        }

        int len = (cr + 2) - readerIndex();

        return buf.readSlice(len);
    }

    protected boolean readRequestLine() {
        ByteBuf line = readLine();
        if (line == null) {
            return false;
        }

        int space = line.indexOf(line.readerIndex(), line.readerIndex() + line.readableBytes(), (byte) ' ');
        if (space < 0) {
            setError(Error.INVALID_METHOD);
            return false;
        }

        int len = space - line.readerIndex();

        ByteBuf methodBuf = line.readSlice(len);

        String methodName = methodBuf.toString(UTF8);
        for (int i = 0; i < METHODS.length; ++i) {
            if (METHODS[i].equals(methodName)) {
                this.method = i;
                break;
            }
        }

        if (this.method == null) {
            setError(Error.INVALID_METHOD);
            return false;
        }

        if ( "CONNECT".equals( methodName ) ) {
            this.upgrade = true;
        }

        // skip the space
        line.readByte();

        space = line.indexOf(line.readerIndex(), line.readerIndex() + line.readableBytes(), (byte) ' ');

        ByteBuf urlBuf = null;
        ByteBuf versionBuf = null;
        if (space < 0) {
            // HTTP/1.0
            urlBuf = line.readSlice(line.readableBytes());
        } else {
            len = space - line.readerIndex();
            urlBuf = line.readSlice(len);
            versionBuf = line.readSlice(line.readableBytes());
        }

        this.url = urlBuf.toString(UTF8).trim();

        if (versionBuf != null) {
            if (!readVersion(versionBuf)) {
                setError(Error.INVALID_VERSION);
                return false;
            }
        } else {
            this.versionMajor = 1;
            this.versionMinor = 0;
        }
        return true;
    }

    protected boolean readStatusLine() {
        ByteBuf line = readLine();

        if (line == null) {
            return false;
        }

        int space = line.indexOf(line.readerIndex(), line.readerIndex() + line.readableBytes(), (byte) ' ');

        if (space < 0) {
            setError(Error.INVALID_VERSION);
            return false;
        }

        int len = space - line.readerIndex();

        ByteBuf versionBuf = line.readSlice(len);

        if (!readVersion(versionBuf)) {
            setError(Error.INVALID_VERSION);
            return false;
        }

        // skip space
        line.readByte();

        space = line.indexOf(line.readerIndex(), line.readerIndex() + line.readableBytes(), (byte) ' ');

        if (space < 0) {
            setError(Error.INVALID_STATUS);
            return false;
        }

        len = space - line.readerIndex();

        ByteBuf statusBuf = line.readSlice(len);

        int status = -1;

        try {
            status = Integer.parseInt(statusBuf.toString(UTF8));
        } catch (NumberFormatException e) {
            setError(Error.INVALID_STATUS);
            return false;
        }

        if (status > 999 || status < 100) {
            setError(Error.INVALID_STATUS);
            return false;
        }

        this.statusCode = status;

        // skip space
        line.readByte();

        ByteBuf messageBuf = line.readSlice(line.readableBytes());

        this.statusMessage = messageBuf.toString(UTF8).trim();

        return true;
    }

    protected boolean readVersion(ByteBuf versionBuf) {
        int dotLoc = versionBuf.indexOf(versionBuf.readerIndex(), versionBuf.readerIndex() + versionBuf.readableBytes(), (byte) '.');
        if (dotLoc < 0) {
            return false;
        }

        char majorChar = (char) versionBuf.getByte(dotLoc - 1);
        char minorChar = (char) versionBuf.getByte(dotLoc + 1);
        try {
            this.versionMajor = Integer.parseInt("" + majorChar);
            this.versionMinor = Integer.parseInt("" + minorChar);
        } catch (NumberFormatException e) {
            return false;
        }
        return true;
    }


    protected int readHeaders() {
        return readHeaders(this.headers, true);
    }

    protected int readTrailers() {
        return readHeaders(this.trailers, false);
    }

    protected int readHeaders(List<String> target, boolean analyze) {
        while (true) {
            ByteBuf line = readLine();
            if (line == null) {
                // try again next time
                return 1;
            }

            if (line.readableBytes() == 2) {
                // end-of-headers
                return 0;
            }

            if (!readHeader(line, target, analyze)) {
                setError(Error.INVALID_HEADER_TOKEN);
                return -1;
            }
        }
    }

    protected boolean readHeader(ByteBuf line, List<String> target, boolean analyze) {
        int colonLoc = line.indexOf(line.readerIndex(), line.readerIndex() + line.readableBytes(), (byte) ':');

        if (colonLoc < 0) {
            return false;
        }

        int len = colonLoc - line.readerIndex();
        ByteBuf keyBuf = line.readSlice(len);

        // skip colon
        line.readByte();

        ByteBuf valueBuf = line.readSlice(line.readableBytes());

        String key = keyBuf.toString(UTF8).trim();
        String value = valueBuf.toString(UTF8).trim();

        target.add(key);
        target.add(value);

        if (analyze) {
            return analyzeHeader(key.toLowerCase(), value);
        }

        return true;
    }

    protected boolean analyzeHeader(String name, String value) {
        if ("content-length".equals(name)) {
            try {
                this.length = Integer.parseInt(value);
            } catch (NumberFormatException e) {
                setError(Error.INVALID_CONTENT_LENGTH);
                return false;
            }
        } else if ("transfer-encoding".equals(name)) {
            if (value.toLowerCase().contains("chunked")) {
                this.chunked = true;
            }
        } else if ("connection".equals(name)) {
            if (value.toLowerCase().contains("close")) {
                this.shouldKeepAlive = false;
            }
        } else if ( "upgrade".equals(name) ) {
            this.upgrade = true;
        }

        return true;
    }

    protected boolean readChunkStart() {
        ByteBuf line = readLine();
        if (line == null) {
            return false;
        }

        try {
            int len = Integer.parseInt(line.toString(UTF8).trim(), 16);
            this.length = len;
        } catch (NumberFormatException e) {
            setError(Error.INVALID_CHUNK_SIZE);
            return false;
        }

        return true;
    }

    protected boolean readChunkEnd() {
        ByteBuf line = readLine();

        if (line == null) {
            return false;
        }

        if (line.readableBytes() != 2) {
            setError(Error.INVALID_FRAGMENT);
            return false;
        }

        return true;

    }

    protected ByteBuf readBody() {
        ByteBuf data = null;
        if (this.buf.readableBytes() <= this.length) {
            data = this.buf.readSlice(this.buf.readableBytes());
            this.length -= data.readableBytes();
        } else {
            data = this.buf.readSlice(this.length);
            this.length = 0;
        }

        return data;
    }

    public void finish() {
        if ( this.type == RESPONSE && this.statusCode == 100 ) {
            reinitialize( RESPONSE );
        }
        if ( this.skipBody ) {
            return;
        }
        emit("messageComplete", CallbackResult.EMPTY_SUCCESS);
    }

}
