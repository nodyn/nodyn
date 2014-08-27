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
import java.util.HashMap;
import java.util.Map;

/**
 * @author Lance Ball (lball@redhat.com)
 */
public class UDPWrap extends HandleWrap {

    private ChannelFuture channelFuture;
    private InetAddress localAddress;
    private Family family;
    private int port;

    public UDPWrap(NodeProcess process) {
        super(process, false);
    }

    public Object bind(final String address, final int port, int flags, final Family family) throws InterruptedException {
        this.family = family;
        this.port = port;
        try {
            if (this.family == Family.IPv4) {
                localAddress = Inet4Address.getByName(address);
            } else {
                localAddress = Inet6Address.getByAddress(address.getBytes());
            }
            Bootstrap bootstrap = new Bootstrap();
            this.channelFuture = bootstrap.group(this.getEventLoopGroup())
                                        .channel(NioDatagramChannel.class)
                                        .option(ChannelOption.SO_BROADCAST, true)
                                        .option(ChannelOption.AUTO_READ, false)
                                        .handler(new DatagramInboundHandler(this))
                                        .bind(localAddress, port);
        } catch (Exception e) {
            e.printStackTrace();
            return e; // if failure, return an error - udp_wrap.js should turn this into a JS Error
        }
        return null;
    }

    public void send(ByteBuf buf, int offset, int length, int port, String address, Family family) {

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

    public Map getSockName() {
        Map result = new HashMap<String, Object>();
        result.put("address", localAddress.getHostAddress());
        result.put("port", this.port);
        result.put("family", this.family.toString());
        return result;
    }
}
