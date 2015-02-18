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

import java.nio.ByteBuffer;
import jnr.posix.POSIX;

/**
 * @author Lance Ball
 */
public class Fs {
    public static int read(POSIX posix, int fd, ByteBuffer buf, int offset, int length) {
        byte[] input = new byte[length];
        int read = posix.read(fd, input, length);
        if (read != -1) {
            buf.position(offset);
            buf.put(input, offset, read);
            buf.position(Math.max(buf.position(), offset + read));
        }
        return read;
    }

    public static int pread(POSIX posix, int fd, ByteBuffer buf, int offset, int length, int position) {
        byte[] input = new byte[length];
        int read = posix.pread(fd, input, length, position);
        if (read != -1) {
            buf.position(offset);
            buf.put(input, 0, read);
            buf.position(Math.max(buf.position(), offset + read));
        }
        return read;
    }
}
