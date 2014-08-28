package io.nodyn.udp;

import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.nodyn.netty.DebugHandler;
import io.nodyn.netty.UnrefHandler;

/**
 * @author Lance Ball
 */
public class DatagramChannelInitializer extends ChannelInitializer<Channel> {

    private final UDPWrap udpWrap;

    public DatagramChannelInitializer(UDPWrap udpWrap) {
        this.udpWrap = udpWrap;
    }

    @Override
    protected void initChannel(Channel channel) throws Exception {

        channel.config().setAutoRead(false)
                .setOption(ChannelOption.SO_BROADCAST, true);

        channel.pipeline().addLast("recv", new DatagramInboundHandler(udpWrap))
//                          .addLast("debug", new DebugHandler("UDP"))
                          .addLast("handle", new UnrefHandler(udpWrap));
    }
}
