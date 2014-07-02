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
public class CheckContinueEventHandler extends AbstractServerHandler {

    public CheckContinueEventHandler(NetServerWrap server) {
        super(server);
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpRequest) {
            String expectHeader = ((HttpRequest) msg).headers().get(HttpHeaders.Names.EXPECT);
            if (expectHeader != null && expectHeader.equalsIgnoreCase("100-Continue")) {
                SocketWrap socket = socket(ctx);
                ServerIncomingMessageWrap incoming = new ServerIncomingMessageWrap(socket, (HttpRequest) msg);
                ServerResponseWrap response = new ServerResponseWrap(ctx.channel());
                this.server.emit("checkContinue", CallbackResult.createSuccess(incoming, response));
                return;
            }
        }
        super.channelRead(ctx, msg);
    }
}
