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

package io.nodyn.loop;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.nodyn.loop.RefEvents;
import io.nodyn.loop.RefHandle;

/**
 * @author Bob McWhirter
 */
public class RefHandleHandler extends ChannelInboundHandlerAdapter {

    private final RefHandle handle;

    public RefHandleHandler(RefHandle handle) {
        this.handle = handle;
    }

    @Override
    public void channelRegistered(ChannelHandlerContext ctx) throws Exception {
        this.handle.ref();
        super.channelRegistered(ctx);
    }

    @Override
    public void channelUnregistered(ChannelHandlerContext ctx) throws Exception {
        this.handle.unref();
        super.channelUnregistered(ctx);
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if ( evt == RefEvents.REF ) {
            this.handle.ref();
        } else if ( evt == RefEvents.UNREF ) {
            this.handle.unref();
        }
        super.userEventTriggered(ctx, evt);
    }

}
