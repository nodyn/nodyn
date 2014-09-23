package io.nodyn.netty.pipe.ipc;

import io.netty.buffer.ByteBuf;

import java.nio.charset.Charset;

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
        return "[IPCRecord: buffer=" + this.buffer + "; buffer.toS=" + this.buffer.toString(Charset.defaultCharset() ) + "; fd=" + this.fd + "]";
    }
}
