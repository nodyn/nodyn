package io.nodyn.http;

import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.HttpContent;
import io.netty.handler.codec.http.LastHttpContent;
import io.netty.util.ReferenceCountUtil;
import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.net.SocketEventsHandler;


/**
 * @author Bob McWhirter
 */
public class IncomingMessageEventsHandler extends SocketEventsHandler {

    private final boolean closeOnEnd;

    public IncomingMessageEventsHandler(EventSource source) {
        this(source, false);
    }

    public IncomingMessageEventsHandler(EventSource source, boolean closeOnEnd) {
        super(source);
        this.closeOnEnd = closeOnEnd;
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpContent) {
            if (msg != LastHttpContent.EMPTY_LAST_CONTENT) {
                ReferenceCountUtil.retain(msg);
                this.source.emit("data", CallbackResult.createSuccess(((HttpContent) msg).content()));
            }
        }
        if (msg instanceof LastHttpContent) {
            this.source.emit("end", CallbackResult.EMPTY_SUCCESS);
            if (closeOnEnd) {
                ctx.channel().close();
            }
        }
        super.channelRead(ctx, msg);
    }
}
