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

package io.nodyn.netty.pipe;

import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.channel.nio.AbstractNioByteChannel;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.Pipe;
import java.nio.charset.Charset;

/**
 * @author Bob McWhirter
 */
public class NioOutputStreamChannel extends AbstractNioStreamChannel {

    private final OutputStream out;

    public static NioOutputStreamChannel create(OutputStream out) throws IOException {
        Pipe pipe = Pipe.open();
        return new NioOutputStreamChannel(out, pipe);
    }

    protected NioOutputStreamChannel(OutputStream out, Pipe pipe) {
        super(pipe);
        try {
            pipe.sink().configureBlocking(false);
        } catch (IOException e) {
            e.printStackTrace();
        }
        this.out = out;
        startPump();
    }

    @Override
    protected Pipe.SinkChannel javaChannel() {
        return pipe.sink();
        //return (Pipe.SinkChannel) super.javaChannel();
    }

    protected void startPump() {
        new Thread() {
            @Override
            public void run() {
                ByteBuffer buf = ByteBuffer.allocate(1024);
                int numRead = 0;
                try {
                    while ( ( numRead = NioOutputStreamChannel.this.pipe.source().read( buf ) ) >= 0 ) {
                        if ( numRead > 0 ) {
                            byte[] writeMe = buf.array();
                            NioOutputStreamChannel.this.out.write(writeMe, 0, numRead);
                            NioOutputStreamChannel.this.out.flush();
                            buf.clear();
                        }
                    }
                } catch (IOException e) {
                    //e.printStackTrace();
                    try {
                        NioOutputStreamChannel.this.pipe.source().close();
                    } catch (IOException e1) {
                        //e1.printStackTrace();
                    }
                }
            }
        }.start();
    }

    @Override
    protected long doWriteFileRegion(FileRegion region) throws Exception {
        return 0;
    }

    @Override
    protected int doReadBytes(ByteBuf byteBuf) throws Exception {
        return 0;
    }

    @Override
    protected int doWriteBytes(ByteBuf buf) throws Exception {
        final int expectedWrittenBytes = buf.readableBytes();
        final int writtenBytes = buf.readBytes(javaChannel(), expectedWrittenBytes);
        return writtenBytes;
    }

    @Override
    protected void doClose() throws Exception {
        this.pipe.source().close();
    }

    public boolean isActive() {
        return this.pipe.source().isOpen();
    }

}
