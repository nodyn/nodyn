package org.projectodd.nodej.bindings.net;

import org.dynjs.runtime.JSFunction;
import org.jboss.netty.channel.ChannelHandlerContext;
import org.jboss.netty.channel.MessageEvent;
import org.jboss.netty.channel.SimpleChannelHandler;

public class ServerHandler extends SimpleChannelHandler {
    
    private JSFunction callback;

    public ServerHandler(JSFunction callback) {
        this.callback = callback;
    }

    @Override
    public void messageReceived(ChannelHandlerContext ctx, MessageEvent e) throws Exception {
        super.messageReceived(ctx, e);
        callback.call(null);
    }

}
