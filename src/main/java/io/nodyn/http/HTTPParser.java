package io.nodyn.http;

import io.netty.buffer.ByteBuf;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;

import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Bob McWhirter
 */
public class HTTPParser extends EventSource {

    private static final Charset UTF8 = Charset.forName("utf8");

    private enum State {
        REQUEST,
        HEADERS,
        BODY,
    }

    private State state;

    private int method;
    private String url;
    private int versionMajor;
    private int versionMinor;
    private Boolean shouldKeepAlive;

    private Map<String, String> headers = new HashMap<>();

    public static final String[] METHODS = new String[]{
            "GET",
            "PUT",
            "POST",
            "DELETE",
    };

    public HTTPParser() {
        this.state = State.REQUEST;
    }

    public void reinitialize() {
        this.state = State.REQUEST;
        this.method = 0;
        this.url = null;
        this.versionMajor = 0;
        this.versionMinor = 0;
        this.headers.clear();
        this.shouldKeepAlive = null;
    }

    public int getMethod() {
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

    public Map<String, String> getHeaders() {
        return this.headers;
    }

    public boolean shouldKeepAlive() {
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
        int numRead = 0;
        LOOP:
        while (buf.readableBytes() > 0) {
            switch (this.state) {
                case REQUEST: {
                    int eol = buf.indexOf(buf.readerIndex(), buf.readerIndex() + buf.readableBytes(), (byte) '\n');
                    if (eol < 0) {
                        return 0;
                    }

                    int len = eol - buf.readerIndex();
                    numRead += len;
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


                    this.state = State.HEADERS;
                    break;
                }
                case HEADERS: {
                    int eol = buf.indexOf(buf.readerIndex(), buf.readerIndex() + buf.readableBytes(), (byte) '\n');
                    int len = eol - buf.readerIndex();
                    numRead += len;
                    String line = buf.toString(buf.readerIndex(), len, UTF8);
                    buf.readerIndex(eol + 1);
                    line = line.trim();
                    if (line.equals("")) {
                        Object result = emit("headersComplete", CallbackResult.EMPTY_SUCCESS);
                        this.state = State.BODY;
                        continue LOOP;
                    }

                    int colonLoc = line.indexOf(':');
                    if (colonLoc < 0) {
                        return -1;
                    }
                    String name = line.substring(0, colonLoc).trim();
                    String value = line.substring(colonLoc + 1).trim();
                    this.headers.put(name, value);
                    if ( name.equalsIgnoreCase( "connection" ) ) {
                        if (value.equalsIgnoreCase( "keep-alive" ) ) {
                            this.shouldKeepAlive = true;
                        }
                    }
                    break;
                }
                case BODY: {
                    System.err.println("break loop");
                    break LOOP;
                }
            }
        }

        return numRead;
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
