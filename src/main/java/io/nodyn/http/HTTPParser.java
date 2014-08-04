package io.nodyn.http;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;

import java.nio.charset.Charset;
import java.util.*;

/**
 * @author Bob McWhirter
 */
public class HTTPParser extends EventSource {

    private static final Charset UTF8 = Charset.forName("utf8");

    public final static int REQUEST = 1;
    public final static int RESPONSE = 2;
    public final static int HEADERS = 3;
    public final static int BODY = 4;
    public final static int TRAILERS = 5;

    public final static int CHUNK_START = 6;
    public final static int CHUNK_CONTENT = 7;

    private int state;

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

    private Integer contentLength;

    private boolean chunked;
    private int chunkLength;

    private int lengthRead;

    private List<String> headers = new ArrayList<>();
    private List<String> trailers = new ArrayList<>();

    private Set<String> expectedTrailers = new HashSet<>();

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

    public HTTPParser() {
    }

    public void reinitialize(int state) {
        this.state = state;
        this.method = null;
        this.url = null;
        this.versionMajor = 0;
        this.versionMinor = 0;
        this.headers.clear();
        this.trailers.clear();
        this.expectedTrailers.clear();
        this.shouldKeepAlive = null;

        this.contentLength = null;
        this.lengthRead = 0;
        this.chunked = false;

        this.statusCode = 0;
        this.statusMessage = "";
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

    public int execute(ByteBuf buf) {
        int numReadable = buf.readableBytes();
        LOOP:
        while (buf.readableBytes() > 0) {
            switch (this.state) {
                case REQUEST: {
                    int eol = buf.indexOf(buf.readerIndex(), buf.readerIndex() + buf.readableBytes(), (byte) '\n');

                    if (eol < 0) {
                        return 0;
                    }

                    int len = eol - buf.readerIndex();
                    String line = buf.toString(buf.readerIndex(), len, UTF8);
                    buf.readerIndex(eol + 1);
                    String[] items = line.split("\\s");

                    if (items.length != 3) {
                        return -1;
                    }

                    this.method = getMethod(items[0]);
                    if (this.method < 0) {
                        return -1;
                    }
                    this.url = items[1];
                    getVersion(items[2]);


                    this.state = HEADERS;
                    break;
                }
                case RESPONSE: {
                    int eol = buf.indexOf(buf.readerIndex(), buf.readerIndex() + buf.readableBytes(), (byte) '\n');
                    if (eol < 0) {
                        return 0;
                    }

                    int len = eol - buf.readerIndex();
                    String line = buf.toString(buf.readerIndex(), len, UTF8);
                    buf.readerIndex(eol + 1);
                    String[] items = line.split("\\s");

                    if (items.length != 3) {
                        return -1;
                    }

                    getVersion(items[0]);
                    this.statusCode = Integer.parseInt(items[1].trim());
                    this.statusMessage = items[2].trim();

                    this.state = HEADERS;
                    break;
                }
                case HEADERS: {
                    int eol = buf.indexOf(buf.readerIndex(), buf.readerIndex() + buf.readableBytes(), (byte) '\n');
                    int len = eol - buf.readerIndex();
                    String line = buf.toString(buf.readerIndex(), len, UTF8);
                    buf.readerIndex(eol + 1);
                    line = line.trim();
                    if (line.equals("")) {
                        Object result = emit("headersComplete", CallbackResult.EMPTY_SUCCESS);
                        if (this.chunked) {
                            this.state = CHUNK_START;
                        } else {
                            this.state = CHUNK_START;
                            this.state = BODY;
                        }
                        continue LOOP;
                    }

                    int colonLoc = line.indexOf(':');
                    if (colonLoc < 0) {
                        return -1;
                    }
                    String name = line.substring(0, colonLoc).trim();
                    String value = line.substring(colonLoc + 1).trim();
                    this.headers.add(name);
                    this.headers.add(value);
                    if (name.equalsIgnoreCase("connection")) {
                        if (value.equalsIgnoreCase("keep-alive")) {
                            this.shouldKeepAlive = true;
                        } else if (value.equalsIgnoreCase("close")) {
                            this.shouldKeepAlive = false;
                        }
                    } else if (name.equalsIgnoreCase("content-length")) {
                        this.contentLength = Integer.parseInt(value.trim());
                    } else if (name.equalsIgnoreCase("transfer-encoding")) {
                        if (value.equalsIgnoreCase("chunked")) {
                            this.chunked = true;
                        }
                    } else if (name.equalsIgnoreCase("trailer")) {
                        String[] names = value.split(",");
                        for (int i = 0; i < names.length; ++i) {
                            this.expectedTrailers.add(names[i].trim().toLowerCase());
                        }
                    }
                    break;
                }
                case TRAILERS: {
                    int eol = buf.indexOf(buf.readerIndex(), buf.readerIndex() + buf.readableBytes(), (byte) '\n');
                    int len = eol - buf.readerIndex();
                    String line = buf.toString(buf.readerIndex(), len, UTF8);

                    if ( line.trim().equals( "" ) ) {
                        emit("messageComplete", CallbackResult.EMPTY_SUCCESS);
                        return 0;
                    }

                    int colonLoc = line.indexOf(':');
                    if (colonLoc < 0) {
                        emit("messageComplete", CallbackResult.EMPTY_SUCCESS);
                        return 0;
                    }

                    String name = line.substring(0, colonLoc).trim();
                    String value = line.substring(colonLoc + 1).trim();


                    if (this.expectedTrailers.contains(name.toLowerCase())) {
                        this.trailers.add(name);
                        this.trailers.add(value);
                    } else {
                        emit("messageComplete", CallbackResult.EMPTY_SUCCESS);
                        return 0;
                    }
                    buf.readerIndex(eol + 1);
                    line = line.trim();
                    break;
                }
                case BODY: {
                    if (buf.readableBytes() == 0) {
                        // found EOF?
                        emit("messageComplete", CallbackResult.EMPTY_SUCCESS);
                        return 0;
                    }
                    if (this.contentLength != null && this.lengthRead + buf.readableBytes() > this.contentLength) {
                        int remaining = this.contentLength - this.lengthRead;
                        this.lengthRead = this.contentLength;
                        buf = buf.readSlice(remaining);
                        emit("body", CallbackResult.createSuccess(Unpooled.wrappedBuffer(buf)));
                        buf.readerIndex(buf.readerIndex() + remaining);
                    } else {
                        this.lengthRead += buf.readableBytes();
                        emit("body", CallbackResult.createSuccess(Unpooled.wrappedBuffer(buf)));
                        buf.readerIndex(buf.readerIndex() + buf.readableBytes());
                    }
                    if (this.contentLength != null && this.lengthRead == this.contentLength) {
                        emit("messageComplete", CallbackResult.EMPTY_SUCCESS);
                    }
                    break LOOP;
                }
                case CHUNK_START: {
                    int eol = buf.indexOf(buf.readerIndex(), buf.readerIndex() + buf.readableBytes(), (byte) '\n');
                    if (eol < 0) {
                        return 0;
                    }

                    int len = eol - buf.readerIndex();
                    String line = buf.toString(buf.readerIndex(), len, UTF8);
                    buf.readerIndex(eol + 1);

                    this.chunkLength = Integer.parseInt(line.trim(), 16);

                    if (this.chunkLength == 0) {
                        if (this.expectedTrailers.isEmpty()) {
                            buf.readerIndex( buf.readerIndex() + 2 );
                            emit("messageComplete", CallbackResult.EMPTY_SUCCESS);
                            break LOOP;
                        } else {
                            this.state = TRAILERS;
                        }
                    } else {
                        this.state = CHUNK_CONTENT;
                    }
                    break;
                }
                case CHUNK_CONTENT: {
                    if (this.lengthRead + buf.readableBytes() > this.chunkLength) {
                        int remaining = this.chunkLength - this.lengthRead;
                        this.lengthRead = this.chunkLength;
                        ByteBuf chunk = buf.readSlice(remaining);
                        emit("body", CallbackResult.createSuccess(chunk));
                    } else {
                        this.lengthRead += buf.readableBytes();
                        emit("body", CallbackResult.createSuccess(Unpooled.wrappedBuffer(buf)));
                        buf.readerIndex(buf.readerIndex() + buf.readableBytes());
                    }
                    if (this.lengthRead == this.chunkLength) {
                        this.lengthRead = 0;
                        buf.readerIndex(buf.readerIndex() + 2);
                        this.state = CHUNK_START;
                    }
                    break;
                }
            }
        }

        int numRead = numReadable - buf.readableBytes();
        return numRead;
    }

    public void finish() {
        emit("messageComplete", CallbackResult.EMPTY_SUCCESS);
    }

    protected int getMethod(String method) {
        for (int i = 0; i < METHODS.length; ++i) {
            if (METHODS[i].equalsIgnoreCase(method.trim())) {
                return i;
            }
        }

        return -1;
    }

    protected void getVersion(String version) {
        if (version.toUpperCase().startsWith("HTTP/")) {
            String v = version.substring(5).trim();
            int dotLoc = v.indexOf('.');
            this.versionMajor = Integer.parseInt(v.substring(0, dotLoc));
            this.versionMinor = Integer.parseInt(v.substring(dotLoc + 1));
        } else {
            this.versionMajor = 1;
            this.versionMinor = 0;
        }
    }

}
