package org.projectodd.nodej.bindings.net;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.JSFunction;
import org.jboss.netty.channel.ChannelHandlerContext;
import org.jboss.netty.channel.MessageEvent;
import org.jboss.netty.channel.SimpleChannelHandler;

public class ServerHandler extends SimpleChannelHandler {
    
    private JSFunction callback;
    private ExecutionContext context;

    public ServerHandler(ExecutionContext context, JSFunction callback) {
        this.callback = callback;
        this.context  = context;
    }

    @Override
    public void messageReceived(ChannelHandlerContext ctx, MessageEvent e) throws Exception {
        super.messageReceived(ctx, e);
        context.call(callback, context.getGlobalObject(), e);
    }

}
