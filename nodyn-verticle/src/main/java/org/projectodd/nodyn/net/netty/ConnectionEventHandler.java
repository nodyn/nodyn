package org.projectodd.nodyn.net.netty;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelPromise;
import org.projectodd.nodyn.net.EventBroker;
import org.projectodd.nodyn.net.NetServer;

import java.net.SocketAddress;

/**
 * @author Bob McWhirter
 */
public class ConnectionEventHandler extends EventEmittingHandler {

    public ConnectionEventHandler(EventBroker broker) {
        super(broker);
    }

    @Override
    public void connect(ChannelHandlerContext ctx, SocketAddress remoteAddress, SocketAddress localAddress, ChannelPromise future) throws Exception {
        emit(NetServer.Event.CONNECTION );
        super.connect(ctx, remoteAddress, localAddress, future);
    }
}
