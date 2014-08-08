/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
            buf.writerIndex(Math.max(buf.writerIndex(), offset + read));
        }
        return read;
    }

    public static int pread(int fd, ByteBuf buf, int offset, int length, int position) {
        byte[] input = new byte[length];
        int read = posix.pread(fd, input, length, position);
        if (read != -1) {
            buf.setBytes(offset, input, 0, read);
            buf.writerIndex(Math.max(buf.writerIndex(), offset + read));
        }
        return read;
    }
}
