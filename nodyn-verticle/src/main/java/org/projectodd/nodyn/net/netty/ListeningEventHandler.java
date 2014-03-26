package org.projectodd.nodyn.net.netty;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelPromise;
import org.projectodd.nodyn.net.EventBroker;
import org.projectodd.nodyn.net.NetServer;

import java.net.SocketAddress;

/**
 * @author Bob McWhirter
 */
public class ListeningEventHandler extends EventEmittingHandler {

    public ListeningEventHandler(EventBroker broker) {
        super(broker);
    }

    @Override
    public void bind(ChannelHandlerContext ctx, SocketAddress localAddress, ChannelPromise future) throws Exception {
        emit( NetServer.Event.LISTENING );
        super.bind(ctx, localAddress, future);
    }
}
