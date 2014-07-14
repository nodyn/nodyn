package io.nodyn.net;

import io.netty.channel.ChannelDuplexHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.util.AttributeKey;
import io.nodyn.CallbackResult;
import io.nodyn.net.NetServerWrap;
import org.vertx.java.core.http.HttpServer;

/**
 * @author Bob McWhirter
 */
public class AbstractServerHandler extends ChannelDuplexHandler {

    protected NetServerWrap server;

    public AbstractServerHandler(NetServerWrap server) {
        this.server = server;
    }

    protected SocketWrap socket(ChannelHandlerContext ctx) {
        return ctx.channel().attr(SocketWrappingHandler.SOCKET).get();
    }
}
