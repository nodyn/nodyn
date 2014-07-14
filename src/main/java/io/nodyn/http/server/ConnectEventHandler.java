package io.nodyn.http.server;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelPromise;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.LastHttpContent;
import io.netty.util.AttributeKey;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.http.TrailerHandler;
import io.nodyn.net.AbstractServerHandler;
import io.nodyn.net.NetServerWrap;
import io.nodyn.net.SocketWrap;


/**
 * @author Bob McWhirter
 */
public class ConnectEventHandler extends AbstractServerHandler {

    public ConnectEventHandler(NetServerWrap server) {
        super(server);
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpRequest) {
            if (((HttpRequest) msg).getMethod().equals(HttpMethod.CONNECT)) {
                SocketWrap socket = socket(ctx);
                ServerIncomingMessageWrap incoming = new ServerIncomingMessageWrap(socket, (HttpRequest) msg);
                ctx.pipeline().remove( "http.encoder" );
                ctx.pipeline().remove( "http.decoder" );
                this.server.emit("connect", CallbackResult.createSuccess(incoming));
                return;
            }
        }

        super.channelRead(ctx, msg);
    }

}
