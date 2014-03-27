package org.projectodd.nodyn.net;

import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import org.projectodd.nodyn.EventBroker;

import java.net.SocketAddress;
import java.nio.charset.Charset;

/**
 * @author Bob McWhirter
 */
public class NetSocket extends EventBroker {

    private final Channel channel;

    public NetSocket(Channel channel) {
        this.channel = channel;
    }

    public SocketAddress remoteAddress() {
        return this.channel.remoteAddress();
    }

    public Channel channel() {
        return this.channel;
    }

    public void write(Object data, String encoding, final Runnable callback) {
        ChannelFuture future = null;
        if (data instanceof CharSequence) {
            future = this.channel.write(Unpooled.copiedBuffer((CharSequence) data, Charset.forName(encoding)));
        } else {
            future = this.channel.write(data);
        }
        if ( callback != null ) {
            future.addListener( new ChannelFutureListener() {
                @Override
                public void operationComplete(ChannelFuture future) throws Exception {
                    callback.run();
                }
            } );
        }
    }

    public void close() {
        this.channel.close();
    }

    public void pause() {
        this.channel.config().setAutoRead( false );
    }

    public void resume() {
        this.channel.config().setAutoRead( true );
    }

}
