package io.nodyn.buffer;

import io.netty.buffer.ByteBuf;
import org.dynjs.runtime.ExternalIndexedData;

/**
 * @author Bob McWhirter
 */
public class NettyExternalIndexedData implements ExternalIndexedData {

    private final ByteBuf buf;

    public NettyExternalIndexedData(ByteBuf buf) {
        this.buf = buf;
    }

    public ByteBuf buffer() {
        return this.buf;
    }

    @Override
    public Object get(long l) {
        return this.buf.getUnsignedByte((int) l);
    }

    @Override
    public void put(long l, Object o) {
        if (o instanceof Number) {
            int value = ((Number) o).intValue() & 0xFF;
            this.buf.setByte((int) l, value );
        } else {
            System.err.println("ATTEMPT TO PUT: " + o);
        }
    }
}
