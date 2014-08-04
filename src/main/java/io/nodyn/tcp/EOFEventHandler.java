package io.nodyn.tcp;

import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelPromise;
import io.nodyn.CallbackResult;
import io.nodyn.process.NodeProcess;

/**
 * @author Bob McWhirter
 */
public class EOFEventHandler extends AbstractEventSourceHandler {

    public EOFEventHandler(NodeProcess process, TCPWrap tcp) {
        super( process, tcp );
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        emit( "eof", CallbackResult.EMPTY_SUCCESS );
        super.channelInactive(ctx);
    }
}
