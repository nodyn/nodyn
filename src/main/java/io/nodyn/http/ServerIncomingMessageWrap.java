package io.nodyn.http;

import io.netty.channel.ChannelInboundHandler;
import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpRequest;
import io.nodyn.EventSource;
import io.nodyn.net.SocketWrap;

/**
 * @author Bob McWhirter
 */
public class ServerIncomingMessageWrap extends EventSource {

    private final SocketWrap socket;
    private final HttpRequest request;
    private HttpHeaders trailers;


    public ServerIncomingMessageWrap(SocketWrap socket, HttpRequest request) {
        this.socket = socket;
        this.request = request;
    }

    public String getHttpVersion() {
        return this.request.getProtocolVersion().toString();
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

    public SocketWrap getSocket() {
        return this.socket;
    }


    public void _readStart() {
        this.socket.readStart();
    }

    public void _readStop() {
        this.socket.readStop();
    }

    public ChannelInboundHandler handler() {
        return this.socket.handler();
    }


    public void setTrailers(HttpHeaders trailers) {
        this.trailers = trailers;
    }

    public HttpHeaders getTrailers() {
        return trailers;
    }
}
