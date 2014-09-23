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

import io.netty.channel.ChannelHandlerContext;
import io.netty.util.ReferenceCountUtil;
import io.nodyn.NodeProcess;
import io.nodyn.async.AsyncWrap;
import io.nodyn.netty.AbstractEventSourceHandler;


/**
 * @author Bob McWhirter
 */
public class IPCDataEventHandler extends AbstractEventSourceHandler {

    public IPCDataEventHandler(NodeProcess process, AsyncWrap eventSource) {
        super(process, eventSource);
    }


    @Override
    public void channelRead(ChannelHandlerContext ctx, final Object msg) throws Exception {
        this.process.getEventLoop().submitUserTask(new Runnable() {
            @Override
            public void run() {
                emit("dataWithHandle", ReferenceCountUtil.retain(msg));
            }
        }, "ipc-data-with-handle" );
        super.channelRead(ctx, msg);
    }
}
