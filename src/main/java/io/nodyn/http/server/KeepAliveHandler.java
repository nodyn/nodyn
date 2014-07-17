package io.nodyn.http.server;

import io.netty.channel.*;
import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.LastHttpContent;
import io.nodyn.CallbackResult;
import io.nodyn.net.AbstractServerHandler;
import io.nodyn.net.NetServerWrap;
import io.nodyn.net.SocketWrap;


/**
 * @author Bob McWhirter
 */
public class KeepAliveHandler extends AbstractServerHandler {

    boolean keepAlive = true;

    public KeepAliveHandler(NetServerWrap server) {
        super(server);
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if ( msg instanceof HttpRequest ) {
            String connectionHeader = ((HttpRequest) msg).headers().get( HttpHeaders.Names.CONNECTION );
            if ( connectionHeader != null ) {
                if ( "close".equals( connectionHeader ) ) {
                    this.keepAlive = false;
                }
            }
        }
        super.channelRead(ctx, msg);
    }

    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) throws Exception {
        if ( msg instanceof LastHttpContent ) {
            if ( this.keepAlive ) {
                promise.addListener( new ChannelFutureListener() {
                    @Override
                    public void operationComplete(ChannelFuture future) throws Exception {
                        ChannelPipeline pipeline = future.channel().pipeline();
                        ChannelHandler handler = null;

                        handler = pipeline.get("discard");
                        if ( handler != null ) {
                            pipeline.remove( handler );
                        }

                        handler = pipeline.get( "trailers" );
                        if ( handler != null ) {
                            pipeline.remove( handler );
                        }

                        handler = pipeline.get( "incoming.data" );
                        if ( handler != null ) {
                            pipeline.remove( handler );
                        }

                        future.channel().config().setAutoRead(true);
                    }
                });
            } else {
                promise.addListener( ChannelFutureListener.CLOSE );
            }
        }
        super.write(ctx, msg, promise);
    }
}
