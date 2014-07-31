package io.nodyn.stream;

import io.netty.buffer.ByteBuf;

/**
 * @author Bob McWhirter
 */
public interface Writable {

    void write(ByteBuf buf);
    void write(String utfStr);

}
