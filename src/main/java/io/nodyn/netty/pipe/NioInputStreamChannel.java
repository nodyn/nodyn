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
import io.netty.channel.FileRegion;
import io.nodyn.NodeProcess;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.channels.Pipe;

/**
 * @author Bob McWhirter
 */
public class NioInputStreamChannel extends AbstractNioStreamChannel {

    private final InputStream in;
    private final Pipe pipe;

    public static NioInputStreamChannel create(NodeProcess process, InputStream in) throws IOException {
        Pipe pipe = Pipe.open();
        return new NioInputStreamChannel(process, in, pipe);
    }

    protected NioInputStreamChannel(NodeProcess process, InputStream in, Pipe pipe) {
        super(process, pipe);
        this.pipe = pipe;
        this.in = in;
        startPump();
    }

    @Override
    protected Pipe.SourceChannel javaChannel() {
        return (Pipe.SourceChannel) super.javaChannel();
    }

    protected void startPump() {
        this.process.getEventLoop().submitBlockingTask(new Runnable() {

            @Override
            public void run() {
                byte[] buf = new byte[1024];
                int numRead = 0;
                try {
                    while ((numRead = NioInputStreamChannel.this.in.read(buf)) >= 0) {
                        NioInputStreamChannel.this.pipe.sink().write(ByteBuffer.wrap(buf, 0, numRead));
                    }
                    NioInputStreamChannel.this.pipe.sink().close();
                } catch (IOException e) {
                    e.printStackTrace();
                    try {
                        NioInputStreamChannel.this.pipe.sink().close();
                    } catch (IOException e1) {
                        e1.printStackTrace();
                    }
                }
            }
        });
    }

    @Override
    protected long doWriteFileRegion(FileRegion region) throws Exception {
        return 0;
    }

    @Override
    protected int doReadBytes(ByteBuf byteBuf) throws Exception {
        return byteBuf.writeBytes(javaChannel(), byteBuf.writableBytes());
    }

    @Override
    protected int doWriteBytes(ByteBuf buf) throws Exception {
        return 0;
    }

    @Override
    protected void doClose() throws Exception {
        this.pipe.source().close();
    }


    @Override
    public boolean isActive() {
        return this.pipe.source().isOpen();
    }

}
