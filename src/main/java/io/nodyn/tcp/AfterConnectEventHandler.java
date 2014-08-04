package io.nodyn.tcp;

import io.netty.channel.ChannelHandlerContext;
import io.nodyn.EventSource;
import io.nodyn.process.NodeProcess;


/**
 * @author Bob McWhirter
 */
public class AfterConnectEventHandler extends AbstractEventSourceHandler {

    private final TCPWrap tcp;

    public AfterConnectEventHandler(NodeProcess process, TCPWrap tcp) {
        super(process, tcp);
        this.tcp = tcp;
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        ctx.pipeline().addAfter(ctx.name(), "emit.data", new DataEventHandler(this.process, this.tcp));
        emit("afterConnect", this.tcp );
        super.channelActive(ctx);
    }

}
