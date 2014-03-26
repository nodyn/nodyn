package org.projectodd.nodyn.net.netty;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelPromise;
import org.projectodd.nodyn.net.EventBroker;
import org.projectodd.nodyn.net.NetServer;

/**
 * @author Bob McWhirter
 */
public class ErrorEventHandler extends EventEmittingHandler {

    public ErrorEventHandler(EventBroker broker) {
        super(broker);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        emit( NetServer.Event.ERROR );
        super.exceptionCaught(ctx, cause);
    }
}
