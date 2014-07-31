package io.nodyn.stream;

import io.netty.buffer.ByteBuf;
import io.nodyn.Callback;
import io.nodyn.handle.HandleWrap;
import io.nodyn.process.NodeProcess;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

/**
 * @author Bob McWhirter
 */
public class StreamWrap extends HandleWrap {

    private StreamWrapper stream;

    public StreamWrap(NodeProcess process) {
        super(process);
    }

    protected void setStream(StreamWrapper stream) throws IOException, InterruptedException {
        this.stream = stream;
        stream.start();
    }

    public void on(String event, Callback callback) {
        this.stream.on( event, callback );
    }

    public void readStart() {
        if ( stream instanceof InputStreamWrap ) {
            ((InputStreamWrap) stream).readStart();
        }
    }

    public void readStop() {
        if ( stream instanceof InputStreamWrap ) {
            ((InputStreamWrap) stream).readStop();
        }
    }

    public void write(ByteBuf buf) throws IOException {
        if ( stream instanceof OutputStreamWrap ) {
            ((OutputStreamWrap) stream).write(buf);
        }
    }

    public void writeUtf8String(String str) throws IOException {
        ByteBuf buf = stream.getChannel().alloc().buffer();
        buf.writeBytes( str.getBytes( "utf8" ));
        write( buf );
    }

}
