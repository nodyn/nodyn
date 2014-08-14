package io.nodyn.udp;

import io.netty.buffer.ByteBuf;
import io.nodyn.NodeProcess;
import io.nodyn.stream.StreamWrap;

/**
 * @author Lance Ball (lball@redhat.com)
 */
public class UDPWrap extends StreamWrap {
    public UDPWrap(NodeProcess process) {
        super(process, false);
    }

    public void bind(String address, int port, int flags, Family family) {

    }

    public void send(ByteBuf buf, int offset, int length, int port, String address, Family family) {

    }

    public void recvStart() {

    }

    public enum Family {
        IPv4, IPv6;
    }
}
