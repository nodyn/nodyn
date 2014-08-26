package io.nodyn.udp;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelOption;
import io.netty.channel.socket.nio.NioDatagramChannel;
import io.nodyn.NodeProcess;
import io.nodyn.handle.HandleWrap;

import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;

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
                 .channel(NioDatagramChannel.class)
                 .option(ChannelOption.SO_BROADCAST, true)
                 .option(ChannelOption.AUTO_READ, false)
                 .handler(new DatagramInboundHandler(this));
    }

    public Object bind(String address, int port, int flags, Family family) {
        try {
            InetAddress addr;
            if(family == Family.IPv4) {
                addr = Inet4Address.getByName(address);
            } else {
                addr = Inet6Address.getByAddress(address.getBytes());
            }
            channelFuture = bootstrap.bind(addr, port);
//            System.err.println(">>>> Bound called. Syncing.");
//            channelFuture.sync();
//            System.err.println(">>>> Bind complete.");
        } catch (Exception e) {
            e.printStackTrace();
            return e; // if failure, return an error - udp_wrap.js should turn this into a JS Error
        }
        return null; // indicates success
    }

    public void send(ByteBuf buf, int offset, int length, int port, String address, Family family) {

    }

    public void recvStart() {
        bootstrap.option(ChannelOption.AUTO_READ, true);
    }

    public void recvStop() {
        bootstrap.option(ChannelOption.AUTO_READ, false);
    }

    public void close() {
        if (this.channelFuture != null && this.channelFuture.channel() != null) {
            this.channelFuture.addListener(ChannelFutureListener.CLOSE);
        }
        super.close();
    }
}
