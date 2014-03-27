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
public class ServerEventHandler extends EventEmittingHandler {

    public ServerEventHandler(EventBroker broker) {
        super(broker);
    }

    @Override
    public void bind(ChannelHandlerContext ctx, SocketAddress localAddress, ChannelPromise future) throws Exception {
        emit( NetServer.Event.LISTENING );
        super.bind(ctx, localAddress, future);
    }

    @Override
    public void connect(ChannelHandlerContext ctx, SocketAddress remoteAddress, SocketAddress localAddress, ChannelPromise future) throws Exception {
        emit(NetServer.Event.CONNECTION, new NetSocket( ctx.channel()) );
        super.connect(ctx, remoteAddress, localAddress, future);
    }

    @Override
    public void close(ChannelHandlerContext ctx, ChannelPromise future) throws Exception {
        emit( NetServer.Event.CLOSE );
        super.close(ctx, future);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        emit( NetServer.Event.ERROR );
        super.exceptionCaught(ctx, cause);
    }

}
