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

package io.nodyn.netty.pipe.ipc;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOutboundBuffer;
import io.netty.channel.embedded.EmbeddedChannel;
import io.nodyn.NodeProcess;
import io.nodyn.pipe.PipeWrap;
import jnr.constants.platform.SocketLevel;
import jnr.posix.CmsgHdr;
import jnr.posix.MsgHdr;
import jnr.posix.POSIX;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/**
 * @author Bob McWhirter
 */
public class DuplexIPCChannel extends EmbeddedChannel {

    private final Object outboundNotifier = new Object();

    private final POSIX posix;
    private final int fd;
    private final NodeProcess process;

    private Thread inPump;
    private Thread outPump;

    private boolean closed;

    public DuplexIPCChannel(PipeWrap pipe, POSIX posix, int fd) {
        super(new IPCDataEventHandler(pipe.getProcess(), pipe));
        this.process = pipe.getProcess();
        //pipeline().removeLast();
        this.posix = posix;
        this.fd = fd;
        startPumps();
    }

    protected void startPumps() {

        this.inPump = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    doReadLoop();
                } catch (Throwable t) {
                    DuplexIPCChannel.this.process.getNodyn().handleThrowable(t);
                }
            }
        });

        this.inPump.setDaemon(true);
        this.inPump.start();

        this.outPump = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    doWriteLoop();
                } catch (Throwable t) {
                    DuplexIPCChannel.this.process.getNodyn().handleThrowable(t);
                }
            }
        });

        this.outPump.setDaemon(true);
        this.outPump.start();
    }

    @Override
    public ChannelFuture close() {
        MsgHdr message = posix.allocateMsgHdr();
        ByteBuffer nioBuf = ByteBuffer.allocateDirect(1);
        nioBuf.put( (byte) 0 );
        nioBuf.flip();
        message.setIov(new ByteBuffer[]{ nioBuf });
        int result = posix.sendmsg( this.fd, message, 0 );
        result = posix.fsync(this.fd);


        this.closed = true;
        posix.close(this.fd);
        this.inPump.interrupt();
        this.outPump.interrupt();
        return super.close();
    }

    protected void doReadLoop() {

        //while ((numRead = posix.recvmsg(this.fd, message, 0)) >= 0) {
        while (true) {
            ByteBuffer buffer = ByteBuffer.allocateDirect(1024);

            MsgHdr message = posix.allocateMsgHdr();
            message.allocateControl(4);
            message.setIov(new ByteBuffer[]{buffer});
            CmsgHdr control = message.getControls()[0];

            int numRead = posix.recvmsg(this.fd, message, 0);
            if (numRead < 0) {
                if (!this.closed) {
                    writeInbound(new IPCRecord(null, -1));
                }
                break;
            }

            if (numRead > 0) {
                if ( numRead == 1 ) {
                    int position = buffer.position();
                    if( buffer.get() == 0 ) {
                        writeInbound(new IPCRecord(null, -1));
                        break;
                    }
                    buffer.position( position );
                }
                int fd = -1;
                buffer.limit(numRead);
                ByteBuf nettyBuf = alloc().buffer(numRead);
                nettyBuf.writeBytes(buffer);
                if (control.getType() == 0x01 && control.getLevel() == SocketLevel.SOL_SOCKET.intValue()) {
                    fd = control.getData().order(ByteOrder.nativeOrder()).getInt();
                }
                IPCRecord record = new IPCRecord(nettyBuf, fd);
                writeInbound(record);
            } else {
                writeInbound(new IPCRecord(null, -1));
                break;
            }
        }
    }

    protected void doWriteLoop() {
        try {
            while (true) {
                Object outbound = null;
                synchronized (outboundNotifier) {
                    while (outboundMessages().isEmpty()) {
                        outboundNotifier.wait();
                    }
                    outbound = outboundMessages().poll();
                }

                doWriteOutbound(outbound);
            }
        } catch (InterruptedException e) {
            // exit the loop
        }
    }

    protected void doWriteOutbound(Object outbound) {
        int fd = -1;
        ByteBuf buf = null;

        if (outbound instanceof IPCRecord) {
            buf = ((IPCRecord) outbound).getBuffer();
            fd = ((IPCRecord) outbound).getFd();
        } else if (outbound instanceof ByteBuf) {
            buf = (ByteBuf) outbound;
        } else {
            return;
        }

        ByteBuffer nioBuf = ByteBuffer.allocateDirect(buf.readableBytes());
        buf.readBytes(nioBuf);
        nioBuf.flip();

        MsgHdr message = posix.allocateMsgHdr();
        message.setIov(new ByteBuffer[]{nioBuf});

        if (fd >= 0) {
            CmsgHdr control = message.allocateControl(4);
            ByteBuffer fdBuf = ByteBuffer.allocateDirect(4);
            fdBuf.order(ByteOrder.nativeOrder());
            fdBuf.putInt(fd);
            fdBuf.flip();
            control.setData(fdBuf);
            control.setType(0x01);
            control.setLevel(SocketLevel.SOL_SOCKET.intValue());
        }

        int result = posix.sendmsg(this.fd, message, 0);
    }

    @Override
    protected void doWrite(ChannelOutboundBuffer in) throws Exception {
        super.doWrite(in);
        synchronized (outboundNotifier) {
            outboundNotifier.notifyAll();
        }
    }
}

