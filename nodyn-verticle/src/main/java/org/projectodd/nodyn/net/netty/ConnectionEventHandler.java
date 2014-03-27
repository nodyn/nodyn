package org.projectodd.nodyn.net.netty;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelPromise;
import org.projectodd.nodyn.EventBroker;
import org.projectodd.nodyn.net.NetServer;
import org.projectodd.nodyn.net.NetSocket;

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
        emit(NetSocket.Event.CONNECT);
        super.connect(ctx, remoteAddress, localAddress, future);
    }

    @Override
    public void close(ChannelHandlerContext ctx, ChannelPromise future) throws Exception {
        emit( NetSocket.Event.CLOSE );
        super.close(ctx, future);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        emit( NetSocket.Event.ERROR );
        super.exceptionCaught(ctx, cause);
    }

}
