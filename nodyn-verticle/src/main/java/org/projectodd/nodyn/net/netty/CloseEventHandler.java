package org.projectodd.nodyn.net.netty;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelPromise;
import org.projectodd.nodyn.net.EventBroker;
import org.projectodd.nodyn.net.NetServer;

import java.net.SocketAddress;

/**
 * @author Bob McWhirter
 */
public class CloseEventHandler extends EventEmittingHandler {

    public CloseEventHandler(EventBroker broker) {
        super(broker);
    }

    @Override
    public void close(ChannelHandlerContext ctx, ChannelPromise future) throws Exception {
        emit( NetServer.Event.CLOSE );
        super.close(ctx, future);
    }
}
