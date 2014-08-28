package io.nodyn.udp;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelOption;
import io.netty.channel.socket.DatagramPacket;
import io.netty.channel.socket.nio.NioDatagramChannel;
import io.nodyn.NodeProcess;
import io.nodyn.handle.HandleWrap;
import sun.nio.ch.Net;

import java.net.*;

/**
 * @author Lance Ball (lball@redhat.com)
 */
public class UDPWrap extends HandleWrap {

    private ChannelFuture channelFuture;
    private InetSocketAddress localAddress;
    private final Bootstrap bootstrap;

    public UDPWrap(NodeProcess process) {
        super(process, false);
        bootstrap = new Bootstrap();
        bootstrap.group(getEventLoopGroup())
                .channel(NioDatagramChannel.class);
    }

    public Object bind(final String address, final int port, int flags, final Family family) throws InterruptedException {
        // TODO: Deal with flags
        try {
            if (family == Family.IPv6) {
                localAddress = new InetSocketAddress(Inet6Address.getByName(address), port);
            } else {
                localAddress = new InetSocketAddress(Inet4Address.getByName(address), port);
            }
            bootstrap.handler(new DatagramChannelInitializer(UDPWrap.this))
                     .localAddress(localAddress);

            this.channelFuture = bootstrap.bind(localAddress);
            this.channelFuture.sync();
        } catch (Exception e) {
            e.printStackTrace();
            return e; // if failure, return an error - udp_wrap.js should turn this into a JS Error
        }
        ref();
        return null;
    }

    public Object send(ByteBuf buf, int offset, int length, int port, String address, Family family) {
        try {
            InetSocketAddress remoteAddress;
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

    public void setBroadcast(int arg) {
        setChannelOption(ChannelOption.SO_BROADCAST, arg == 1);
    }

    public void setTTL(int arg) {
        // TODO: Should this be a different channel option?
        setChannelOption(ChannelOption.IP_MULTICAST_TTL, arg);
    }

    public void setMulticastTTL(int arg) {
        setChannelOption(ChannelOption.IP_MULTICAST_TTL, arg);
    }

    public void setMulticastLoopback(int arg) {
        setChannelOption(ChannelOption.IP_MULTICAST_LOOP_DISABLED, arg == 1);
    }

    public void addMembership(String mcastAddr, String ifaceAddr) {
        try {
            if (mcastAddr != null) {
                InetAddress mcast = InetAddress.getByName(mcastAddr);
                setChannelOption(ChannelOption.IP_MULTICAST_ADDR, mcast);
            }
            if (ifaceAddr != null) {
                System.err.println(">>>>>>>>>> SETTING IFACE TO "+ifaceAddr);
                NetworkInterface iface = NetworkInterface.getByName(ifaceAddr);
                System.err.println(">>>>>>>>>> SETTING IFACE TO "+iface);
                setChannelOption(ChannelOption.IP_MULTICAST_IF, iface);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
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
        return this.channelFuture.channel().remoteAddress();
    }

    private void setChannelOption(ChannelOption option, Object value) {
        // TODO: Can the options just be set on bootstrap even after a bind()?
        if (channelFuture != null) {
            channelFuture.channel().config().setOption(option, value);
        } else {
            bootstrap.option(option, value);
        }
    }

}
