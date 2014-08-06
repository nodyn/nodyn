package io.nodyn.fs;

import io.nodyn.buffer.BufferWrap;
import jnr.posix.POSIX;
import jnr.posix.POSIXFactory;

/**
 * @author Lance Ball
 */
public class Fs {
    private static final POSIX posix = POSIXFactory.getPOSIX(new io.nodyn.posix.NodePosixHandler(), true);
    public static int read(int fd, BufferWrap buf, int offset, int length, int position) {
        byte[] input = new byte[length];
        System.err.println("OFFSET: "+offset);
        System.err.println("LENGTH: "+length);
        System.err.println("POSITION: "+position);
        int read = posix.pread(fd, input, length, position);
        System.err.println("READ: "+read);
        if (read != -1) {
            new BufferWrap(input).copy(buf, offset, 0, read);
        }
        return read;
    }
}
