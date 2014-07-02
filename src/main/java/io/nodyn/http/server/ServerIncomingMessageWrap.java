package io.nodyn.http.server;

import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpRequest;
import io.nodyn.EventSource;
import io.nodyn.http.IncomingMessageEventsHandler;
import io.nodyn.http.IncomingMessage;
import io.nodyn.net.SocketWrap;

/**
 * @author Bob McWhirter
 */
public class ServerIncomingMessageWrap extends EventSource implements IncomingMessage {

    private final SocketWrap socket;
    private final HttpRequest request;
    private HttpHeaders trailers;


    public ServerIncomingMessageWrap(SocketWrap socket, HttpRequest request) {
        this.socket = socket;
        this.request = request;
    }

    public String getHttpVersion() {
        return getHttpVersionMajor() + "." + getHttpVersionMinor();
    }

    public int getHttpVersionMajor() {
        return this.request.getProtocolVersion().majorVersion();
    }

    public int getHttpVersionMinor() {
        return this.request.getProtocolVersion().minorVersion();
    }

    public String getMethod() {
        return this.request.getMethod().name();
    }

    public String getUrl() {
        return this.request.getUri();
    }

    public HttpHeaders getHeaders() {
        return this.request.headers();
    }

    public SocketWrap getSocket() {
        return this.socket;
    }

    public void readStart() {
        this.socket.readStart();
    }

    public void readStop() {
        this.socket.readStop();
    }

    public void setTrailers(HttpHeaders trailers) {
        this.trailers = trailers;
    }

    public HttpHeaders getTrailers() {
        return trailers;
    }

    public IncomingMessageEventsHandler handler() {
        return new IncomingMessageEventsHandler(this);
    }

    public String toString() {
        return "[ServerIncomingMessage: request=" + this.request + "; socket=" + this.socket + "]";
    }
}
