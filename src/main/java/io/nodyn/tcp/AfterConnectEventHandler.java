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

package io.nodyn.tcp;

import io.netty.channel.ChannelHandlerContext;
import io.nodyn.netty.AbstractEventSourceHandler;
import io.nodyn.process.NodeProcess;


/**
 * @author Bob McWhirter
 */
public class AfterConnectEventHandler extends AbstractEventSourceHandler {

    private final TCPWrap tcp;

    public AfterConnectEventHandler(NodeProcess process, TCPWrap tcp) {
        super(process, tcp);
        this.tcp = tcp;
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        ctx.pipeline().addAfter(ctx.name(), "emit.data", new DataEventHandler(this.process, this.tcp));
        emit("afterConnect", this.tcp );
        super.channelActive(ctx);
    }

}
