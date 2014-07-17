package io.nodyn.http.server;

import io.netty.channel.Channel;
import io.netty.channel.ChannelPipeline;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.http.HttpResponseEncoder;
import io.nodyn.net.NetServerWrap;
import io.nodyn.loop.ManagedEventLoopGroup;

/**
 * @author Bob McWhirter
 */
public class HttpServerWrap extends NetServerWrap {

    private int maxHeadersCount = 1000;

    private long timeout = 120000L;

    public HttpServerWrap(ManagedEventLoopGroup managedLoop) {
        super(managedLoop);
    }

    @Override
    protected void initializeConnectionChannel(Channel channel) {
        initializeConnectionChannelHead(channel);
        channel.config().setAutoRead( true );

        ChannelPipeline pipeline = channel.pipeline();
        pipeline.addLast("http.decoder", new HttpRequestDecoder());
        pipeline.addLast("http.encoder", new HttpResponseEncoder());
        pipeline.addLast( "discard.enabling", new DiscardEnablingHandler() );
        //pipeline.addLast("debug-http", new DebugHandler("server-connection-http"));
        pipeline.addLast("emit.checkContinue", new CheckContinueEventHandler(HttpServerWrap.this));
        pipeline.addLast("emit.connect", new ConnectEventHandler(HttpServerWrap.this));
        pipeline.addLast("emit.upgrade", new UpgradeEventHandler(HttpServerWrap.this));
        pipeline.addLast("emit.request", new RequestEventHandler(HttpServerWrap.this));
        pipeline.addLast("http.keepalive", new KeepAliveHandler(HttpServerWrap.this));

        initializeConnectionChannelTail(channel);
    }

    public void setMaxHeadersCount(int maxHeadersCount) {
        this.maxHeadersCount = maxHeadersCount;
    }

    public int getMaxHeadersCount() {
        return this.maxHeadersCount;
    }

    public void setTimeout(long timeout) {
        this.timeout = timeout;
    }

    public long getTimeout() {
        return this.timeout;
    }

}
