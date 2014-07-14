package io.nodyn.http.server;

import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpRequest;
import io.nodyn.CallbackResult;
import io.nodyn.net.AbstractServerHandler;
import io.nodyn.net.NetServerWrap;
import io.nodyn.net.SocketWrap;


/**
 * @author Bob McWhirter
 */
public class UpgradeEventHandler extends AbstractServerHandler {

    public UpgradeEventHandler(NetServerWrap server) {
        super(server);
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpRequest) {
            String upgradeHeader = ((HttpRequest) msg).headers().get(HttpHeaders.Names.UPGRADE);
            if (upgradeHeader != null) {
                SocketWrap socket = socket(ctx);
                ServerIncomingMessageWrap incoming = new ServerIncomingMessageWrap(socket, (HttpRequest) msg);
                ctx.pipeline().remove("http.encoder");
                ctx.pipeline().remove("http.decoder");
                this.server.emit("upgrade", CallbackResult.createSuccess(incoming));
                return;
            }
        }

        super.channelRead(ctx, msg);
    }

}
