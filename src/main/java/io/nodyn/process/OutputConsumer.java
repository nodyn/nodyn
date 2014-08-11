package io.nodyn.process;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;

import java.io.IOException;
import java.io.InputStream;

/**
 * @author Bob McWhirter
 */
public class OutputConsumer implements Runnable {

    private final InputStream in;
    private final ByteBuf buffer;

    public OutputConsumer(InputStream in) {
        this.in = in;
        buffer = Unpooled.buffer();
    }

    public ByteBuf getBuffer() {
        return this.buffer;
    }

    @Override
    public void run() {
        int read = 0;
        byte[] buf = new byte[1024];

        try {
            while ( ( read = this.in.read( buf ) ) >= 0 ) {
                if ( read > 0 ) {
                    this.buffer.writeBytes(buf, 0, read);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
