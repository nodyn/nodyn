package io.nodyn.udp;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.socket.DatagramPacket;
import io.netty.channel.socket.nio.NioDatagramChannel;
import io.nodyn.NodeProcess;
import io.nodyn.handle.HandleWrap;

import java.net.*;

/**
 * @author Lance Ball (lball@redhat.com)
 */
public class UDPWrap extends HandleWrap {

    private ChannelFuture channelFuture;
    private InetSocketAddress localAddress;
    private InetSocketAddress remoteAddress;

    public UDPWrap(NodeProcess process) {
        super(process, false);
    }

    public Object bind(final String address, final int port, int flags, final Family family) throws InterruptedException {
        // TODO: Deal with flags
        try {
            if (family == Family.IPv6) {
                localAddress = new InetSocketAddress(Inet6Address.getByName(address), port);
            } else {
                localAddress = new InetSocketAddress(Inet4Address.getByName(address), port);
            }
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(getEventLoopGroup())
                    .channel(NioDatagramChannel.class)
                    .handler(new DatagramChannelInitializer(UDPWrap.this))
                    .localAddress(localAddress);

            this.channelFuture = bootstrap.bind(localAddress);
        } catch (Exception e) {
            e.printStackTrace();
            return e; // if failure, return an error - udp_wrap.js should turn this into a JS Error
        }
        ref();
        return null;
    }

    public Object send(ByteBuf buf, int offset, int length, int port, String address, Family family) {
        try {
            if (family == Family.IPv4) remoteAddress = new InetSocketAddress(Inet4Address.getByName(address), port);
            else remoteAddress = new InetSocketAddress(Inet6Address.getByName(address), port);

            // TODO: Why do we have to copy the buffer?
            DatagramPacket packet = new DatagramPacket(buf.copy(offset, length), remoteAddress, localAddress);
            channelFuture.channel().writeAndFlush(packet);
        } catch (UnknownHostException e) {
            e.printStackTrace();
            return e;
        }
        return null;
    }

    public void recvStart() throws Exception {
        channelFuture.channel().config().setAutoRead(true);
    }

    public void recvStop() {
        channelFuture.channel().config().setAutoRead(false);
    }

    public void close() {
        if (this.channelFuture != null && this.channelFuture.channel() != null) {
            this.channelFuture.addListener(ChannelFutureListener.CLOSE);
        }
        super.close();
    }

    public SocketAddress getLocalAddress() {
        return this.localAddress;
    }

    public SocketAddress getRemoteAddress() {
        return this.localAddress;
    }

}
