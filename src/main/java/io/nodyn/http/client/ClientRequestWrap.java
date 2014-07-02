package io.nodyn.http.client;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelPipeline;
import io.netty.handler.codec.http.*;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.http.agent.AgentWrap;
import io.nodyn.net.SocketWrap;

import java.util.concurrent.TimeUnit;

/**
 * @author Bob McWhirter
 */
public class ClientRequestWrap extends EventSource {

    private final AgentWrap agent;

    private HttpRequest request;
    private final String host;
    private final int port;

    private final LastHttpContent last;

    private boolean chunked = false;
    private SocketWrap socket;

    private ChannelFuture connectFuture;

    public ClientRequestWrap(AgentWrap agent, String method, String host, int port, String path) {
        this.agent = agent;
        this.request = new DefaultHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.valueOf(method.toUpperCase()), path);
        this.request.headers().set( HttpHeaders.Names.HOST, host );
        this.host = host;
        this.port = port;
        this.last = new DefaultLastHttpContent();
    }

    public String getHost() {
        return this.host;
    }

    public int getPort() {
        return this.port;
    }

    public void setSocket(SocketWrap socket) {
        this.socket = socket;
    }

    public SocketWrap getSocket() {
        return this.socket;
    }

    public void writeHead() {
        if (this.connectFuture != null ) {
            return;
        }
        this.connectFuture = this.agent.enqueue(this);
        this.connectFuture.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                if (hasBody()) {
                    if (!ClientRequestWrap.this.request.headers().contains(HttpHeaders.Names.CONTENT_LENGTH)) {
                        ClientRequestWrap.this.request.headers().set(HttpHeaders.Names.TRANSFER_ENCODING, "chunked");
                        ClientRequestWrap.this.chunked = true;
                    }
                }
                future.channel().write(ClientRequestWrap.this.request);
            }
        });
    }

    protected boolean hasBody() {
        HttpMethod method = this.request.getMethod();
        if (method == HttpMethod.POST || method == HttpMethod.PUT || method == HttpMethod.PATCH) {
            return true;
        }

        return false;
    }

    public HttpHeaders getHeaders() {
        return this.request.headers();
    }

    public HttpHeaders getTrailers() {
        return this.last.trailingHeaders();
    }

    public void write(final ByteBuf chunk) {
        writeHead();
        this.connectFuture.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                DefaultHttpContent content = new DefaultHttpContent(chunk);
                future.channel().writeAndFlush(content);

            }
        });
    }

    public void end() {
        end(Unpooled.EMPTY_BUFFER);
    }

    public void end(ByteBuf chunk) {
        write(chunk);
        this.connectFuture.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                if (ClientRequestWrap.this.chunked && !ClientRequestWrap.this.last.trailingHeaders().isEmpty()) {
                    future.channel().write(ClientRequestWrap.this.last);
                } else {
                    future.channel().write(DefaultLastHttpContent.EMPTY_LAST_CONTENT);
                }
                future.channel().flush();
            }
        });
    }

    public void abort() {
        this.connectFuture.addListener(ChannelFutureListener.CLOSE);
    }

}
