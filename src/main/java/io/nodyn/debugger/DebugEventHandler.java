package io.nodyn.debugger;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.nodyn.debugger.events.BreakEventBody;
import io.nodyn.debugger.events.DebuggerEvent;
import io.nodyn.debugger.events.ScriptInfo;
import io.nodyn.debugger.events.SourceInfo;

import java.nio.charset.Charset;

/**
 * @author Bob McWhirter
 */
public class DebugEventHandler extends ChannelDuplexHandler {


    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) throws Exception {
        if (msg instanceof DebuggerEvent) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                String json = mapper.writer().writeValueAsString(msg);
                json = json + "\r\n";
                byte[] jsonBytes = json.getBytes(Charset.forName("UTF8"));

                String header = "Content-Length: " + jsonBytes.length + "\r\n\r\n";
                byte[] headerBytes = header.getBytes( Charset.forName( "UTF8" ) );

                ByteBuf out = ctx.alloc().buffer(headerBytes.length + jsonBytes.length);
                out.writeBytes(headerBytes);
                out.writeBytes(jsonBytes);

                super.write(ctx, out, promise);
            } catch (Throwable t ) {
                t.printStackTrace();
            }
        } else {
            super.write(ctx, msg, promise);
        }
    }


    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        SourceInfo location = new SourceInfo(12, 24, "this is the line" );
        ScriptInfo script = new ScriptInfo("foo.js", 0, 0, 10);
        ctx.channel().writeAndFlush( new DebuggerEvent( new BreakEventBody( "howdy", location, script ) ) );
        super.channelRegistered(ctx);
    }
}


