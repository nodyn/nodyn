package org.projectodd.nodej.bindings.net;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.JSFunction;
import org.jboss.netty.channel.ChannelPipeline;
import org.jboss.netty.channel.ChannelPipelineFactory;
import org.jboss.netty.channel.Channels;

public class PipelineFactory implements ChannelPipelineFactory {
    
    private JSFunction callback;
    private ExecutionContext context;

    public PipelineFactory(ExecutionContext context, JSFunction callback) {
        this.callback = callback;
        this.context  = context;
    }

    @Override
    public ChannelPipeline getPipeline() throws Exception {
        return Channels.pipeline(new ServerHandler(this.context, this.callback));
    }

}
