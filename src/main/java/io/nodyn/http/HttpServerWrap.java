package io.nodyn.http;

import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.http.HttpResponseEncoder;
import io.nodyn.net.NetServerWrap;
import io.nodyn.netty.ManagedEventLoopGroup;

/**
 * @author Bob McWhirter
 */
public class HttpServerWrap extends NetServerWrap {

    private int maxHeadersCount;

    public HttpServerWrap(ManagedEventLoopGroup managedLoop) {
        super(managedLoop);
    }

    @Override
    protected ChannelInitializer<Channel> childInitializer() {
        return new ChannelInitializer<Channel>() {
            @Override
            protected void initChannel(Channel ch) throws Exception {
                ch.config().setAutoRead(false);
                ChannelPipeline pipeline = ch.pipeline();
                pipeline.addLast("debug", new DebugHandler( "http-server-connection"));
                pipeline.addLast("http.decoder", new HttpRequestDecoder());
                pipeline.addLast("http.encoder", new HttpResponseEncoder());
                pipeline.addLast("event.dispatcher", new HttpServerEventDispatcher(HttpServerWrap.this));
                ch.read();
            }
        };
    }

    public void setTimeout(int msec, Object callback) {

    }

    public void setMaxHeadersCount(int maxHeadersCount) {
        this.maxHeadersCount = maxHeadersCount;
    }

    public int getMaxHeadersCount() {
        return this.maxHeadersCount;
    }

}
