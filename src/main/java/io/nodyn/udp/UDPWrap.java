package io.nodyn.udp;

import io.netty.bootstrap.Bootstrap;
import io.netty.bootstrap.ChannelFactory;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelOption;
import io.netty.channel.socket.DatagramChannel;
import io.netty.channel.socket.DatagramPacket;
import io.netty.channel.socket.InternetProtocolFamily;
import io.netty.channel.socket.nio.NioDatagramChannel;
import io.nodyn.NodeProcess;
import io.nodyn.buffer.Buffer;
import io.nodyn.handle.HandleWrap;

import java.net.*;
import java.nio.ByteBuffer;
import java.util.Enumeration;

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
        bootstrap.group(this.process.getEventLoop().getEventLoopGroup())
                .handler(new DatagramChannelInitializer(UDPWrap.this));
    }

    public Object bind(final String address, final int port, int flags, final Family family) throws InterruptedException {
        try {
            InetAddress addr = null;
            if (family == Family.IPv6) {
                addr = Inet6Address.getByName( address );
            } else {
                addr = Inet4Address.getByName( address );
            }

            this.localAddress = new InetSocketAddress( addr, port );

            bootstrap.option(ChannelOption.SO_REUSEADDR, flags != 0);
            bootstrap.channelFactory( new ChannelFactory<Channel>() {
                @Override
                public Channel newChannel() {
                    return new NioDatagramChannel( family == Family.IPv4 ? InternetProtocolFamily.IPv4 : InternetProtocolFamily.IPv6 );
                }
            });
            this.channelFuture = bootstrap.localAddress(localAddress).bind();
            this.channelFuture.sync();
        } catch (Exception e) {
            return e; // if failure, return an error - udp_wrap.js should turn this into a JS Error
        }
        ref();
        return null;
    }

    public Object send(ByteBuffer buf, int offset, int length, int port, String address, Family family) {
        try {
            InetSocketAddress remoteAddress;
            if (family == Family.IPv4) {
                remoteAddress = new InetSocketAddress(Inet4Address.getByName(address), port);
            } else {
                remoteAddress = new InetSocketAddress(Inet6Address.getByName(address), port);
            }
            DatagramPacket packet = new DatagramPacket(Unpooled.copiedBuffer(Buffer.extractByteArray(buf), offset, length), remoteAddress, localAddress);
            channelFuture.channel().writeAndFlush(packet);
        } catch (UnknownHostException e) {
            UDPWrap.this.process.getNodyn().handleThrowable(e);
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

    public void addMembership(String mcastAddr, String ifaceAddr) throws UnknownHostException, SocketException {
        InetAddress addr = InetAddress.getByName(mcastAddr);
        if (ifaceAddr == null || ifaceAddr.equals("undefined")) { // nashornism
            Enumeration<NetworkInterface> ifaces = NetworkInterface.getNetworkInterfaces();
            while (ifaces.hasMoreElements()) {
                NetworkInterface candidate = ifaces.nextElement();
                if (candidate.supportsMulticast() && candidate.isUp() ) {
                    ((DatagramChannel) channelFuture.channel()).joinGroup(addr, candidate, null);
                }
            }
        } else  {
            NetworkInterface iface = NetworkInterface.getByInetAddress(InetAddress.getByName(ifaceAddr));
            ((DatagramChannel) channelFuture.channel()).joinGroup(addr, iface, null);
        }

    }

    public void dropMembership(String mcastAddr, String ifaceAddr) throws UnknownHostException, SocketException {
        InetAddress addr = InetAddress.getByName(mcastAddr);
        if (ifaceAddr == null || ifaceAddr.equals("undefined")) { // nashornism
            Enumeration<NetworkInterface> ifaces = NetworkInterface.getNetworkInterfaces();
            while (ifaces.hasMoreElements()) {
                NetworkInterface candidate = ifaces.nextElement();
                if (candidate.supportsMulticast() && candidate.isUp() ) {
                    ((DatagramChannel) channelFuture.channel()).leaveGroup(addr, candidate, null);
                }
            }
        } else  {
            NetworkInterface iface = NetworkInterface.getByInetAddress( InetAddress.getByName( ifaceAddr ));
            ((DatagramChannel) channelFuture.channel()).leaveGroup(addr, iface, null);
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
        if (channelFuture != null) {
            channelFuture.channel().config().setOption(option, value);
        } else {
            bootstrap.option(option, value);
        }
    }

}
