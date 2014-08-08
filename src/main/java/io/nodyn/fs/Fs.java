package io.nodyn.fs;

import io.netty.buffer.ByteBuf;
import jnr.posix.POSIX;
import jnr.posix.POSIXFactory;

/**
 * @author Lance Ball
 */
public class Fs {
    private static final POSIX posix = POSIXFactory.getPOSIX(new io.nodyn.posix.NodePosixHandler(), true);

    public static int read(int fd, ByteBuf buf, int offset, int length) {
        byte[] input = new byte[length];
        int read = posix.read(fd, input, length);
        if (read != -1) {
            buf.setBytes(offset, input, 0, read);
        }
        return read;
    }

    public static int pread(int fd, ByteBuf buf, int offset, int length, int position) {
        byte[] input = new byte[length];
        int read = posix.pread(fd, input, length, position);
        if (read != -1) {
            buf.setBytes(offset, input, 0, read);
        }
        return read;
    }
}
