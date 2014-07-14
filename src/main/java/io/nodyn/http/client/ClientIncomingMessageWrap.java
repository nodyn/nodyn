package io.nodyn.http.client;

import io.netty.channel.ChannelHandler;
import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpResponse;
import io.nodyn.EventSource;
import io.nodyn.http.IncomingMessageEventsHandler;
import io.nodyn.http.IncomingMessage;
import io.nodyn.net.SocketWrap;

/**
 * @author Bob McWhirter
 */
public class ClientIncomingMessageWrap extends EventSource implements IncomingMessage {

    private final SocketWrap socket;
    private final HttpResponse response;
    private HttpHeaders trailers;

    public ClientIncomingMessageWrap(SocketWrap socket, HttpResponse response) {
        this.socket = socket;
        this.response = response;
    }

    public String getHttpVersion() {
        return getHttpVersionMajor() + "." + getHttpVersionMinor();
    }

    public int getHttpVersionMajor() {
        return this.response.getProtocolVersion().majorVersion();
    }

    public int getHttpVersionMinor() {
        return this.response.getProtocolVersion().minorVersion();
    }

    public int getStatusCode() {
        return this.response.getStatus().code();
    }

    public HttpHeaders getHeaders() {
        return this.response.headers();
    }

    public void setTrailers(HttpHeaders trailers) {
        this.trailers = trailers;
    }

    public HttpHeaders getTrailers() {
        return this.trailers;
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

    public ChannelHandler handler() {
        return new IncomingMessageEventsHandler(this, true);
    }
}
