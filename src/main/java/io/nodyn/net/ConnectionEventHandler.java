package io.nodyn.net;

import io.netty.channel.*;
import io.netty.util.AttributeKey;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;


/**
 * @author Bob McWhirter
 */
public class ConnectionEventHandler extends AbstractServerHandler {

    public ConnectionEventHandler(NetServerWrap server) {
        super(server);
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        this.server.incrConnection();
        this.server.emit("connection", CallbackResult.createSuccess(socket(ctx)));
        super.channelActive(ctx);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        this.server.decrConnection();
        super.channelInactive(ctx);
    }

}
