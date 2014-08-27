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

package io.nodyn.netty;

import io.netty.channel.ChannelDuplexHandler;
import io.nodyn.CallbackResult;
import io.nodyn.NodeProcess;
import io.nodyn.async.AsyncWrap;

/**
 * @author Bob McWhirter
 */
public class AbstractEventSourceHandler extends ChannelDuplexHandler {

    protected final NodeProcess process;
    protected final AsyncWrap eventSource;

    public AbstractEventSourceHandler(NodeProcess process, AsyncWrap eventSource) {
        this.process = process;
        this.eventSource = eventSource;
    }

    public void emit(String event) {
         this.eventSource.emit( event, CallbackResult.EMPTY_SUCCESS );
    }

    public void emit(String event, Object value) {
        this.eventSource.emit( event, CallbackResult.createSuccess( value ) );
    }
    
    public void emit(String event, Object...values) {
        this.eventSource.emit( event, CallbackResult.createSuccess( values ) );
    }
}
