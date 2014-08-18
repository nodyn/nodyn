package io.nodyn.netty.pipe.ipc;

import io.netty.buffer.ByteBuf;

/**
 * @author Bob McWhirter
 */
public class IPCRecord {

    private final ByteBuf buffer;
    private final int fd;

    public IPCRecord(ByteBuf buffer, int fd) {
        this.buffer = buffer;
        this.fd = fd;
    }

    public ByteBuf getBuffer() {
        return this.buffer;
    }

    public int getFd() {
        return this.fd;
    }

    public String toString() {
        return "[IPCRecord: buffer=" + this.buffer + "; fd=" + this.fd + "]";
    }
}
