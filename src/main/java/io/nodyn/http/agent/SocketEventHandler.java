package io.nodyn.http.agent;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.nodyn.CallbackResult;
import io.nodyn.http.client.ClientRequestWrap;
import io.nodyn.net.SocketWrap;

/**
 * @author Bob McWhirter
 */
public class SocketEventHandler extends ChannelInboundHandlerAdapter {

    private final ClientRequestWrap request;

    public SocketEventHandler(ClientRequestWrap request) {
        this.request = request;
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if ( evt instanceof SocketWrap ) {
            this.request.setSocket((SocketWrap) evt);
            this.request.emit( "socket", CallbackResult.createSuccess( this.request.getSocket() ) );
        }
        super.userEventTriggered( ctx, evt );
    }
}
