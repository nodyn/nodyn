package io.nodyn.udp;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.channel.socket.DatagramPacket;
import io.netty.channel.socket.oio.OioDatagramChannel;
import io.nodyn.CallbackResult;
import io.nodyn.NodeProcess;
import io.nodyn.handle.HandleWrap;

import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * @author Lance Ball (lball@redhat.com)
 */
public class UDPWrap extends HandleWrap {

    private final Bootstrap bootstrap;
    private ChannelFuture channelFuture;

    public UDPWrap(NodeProcess process) {
        super(process, false);
        bootstrap = new Bootstrap();
        bootstrap.group(this.getEventLoopGroup())
                 .channel(OioDatagramChannel.class)
                 .option(ChannelOption.SO_BROADCAST, true);
    }

    public Object bind(String address, int port, int flags, Family family) {
        try {
            InetAddress addr;
            if(family == Family.IPv4) {
                addr = Inet4Address.getByName(address);
            } else {
                addr = Inet6Address.getByAddress(address.getBytes());
            }
            System.err.println(">>>> Binding on " + addr.toString());
            channelFuture = bootstrap.bind(addr, port);
            System.err.println(">>>> Bound called. Syncing.");
            channelFuture.syncUninterruptibly();
            System.err.println(">>>> Bind complete.");
        } catch (UnknownHostException e) {
            return e; // if failure, return an error - udp_wrap.js should turn this into a JS Error
        }
        return null; // indicates success
    }

    public void send(ByteBuf buf, int offset, int length, int port, String address, Family family) {

    }

    public void recvStart() {
        bootstrap.handler(new DatagramInboundHander(this));
    }

    public void recvStop() {

    }

    public void close() {
        if (this.channelFuture != null && this.channelFuture.channel() != null) {
            this.channelFuture.addListener(ChannelFutureListener.CLOSE);
        }
        super.close();
    }


    private static final class DatagramInboundHander extends SimpleChannelInboundHandler<DatagramPacket> {

        private final UDPWrap udpWrap;

        public DatagramInboundHander(UDPWrap udpWrap) {
            this.udpWrap = udpWrap;
        }

        @Override
        protected void channelRead0(ChannelHandlerContext channelHandlerContext, DatagramPacket datagramPacket) throws Exception {
            // emit message received for JS side
            udpWrap.emit("recv", CallbackResult.createSuccess(datagramPacket.content()));
        }
    }
}
