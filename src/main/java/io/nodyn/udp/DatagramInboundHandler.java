package io.nodyn.udp;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.socket.DatagramPacket;
import io.netty.util.ReferenceCountUtil;
import io.nodyn.CallbackResult;

/**
 * @author Lance Ball
 */
class DatagramInboundHandler extends SimpleChannelInboundHandler<DatagramPacket> {
    private final UDPWrap udpWrap;

    public DatagramInboundHandler(UDPWrap udpWrap) {
        this.udpWrap = udpWrap;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext channelHandlerContext, DatagramPacket datagramPacket) throws Exception {
        // emit message received for JS side
        udpWrap.emit("recv", CallbackResult.createSuccess(ReferenceCountUtil.retain(datagramPacket.content())));
    }
}
