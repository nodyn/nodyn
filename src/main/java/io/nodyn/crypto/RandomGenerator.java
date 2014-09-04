package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;

import java.security.SecureRandom;
import java.util.Random;

/**
 * @author Bob McWhirter
 */
public class RandomGenerator {

    public static ByteBuf random(int size) {
        return random( new SecureRandom(), size );
    }

    public static ByteBuf pseudoRandom(int size) {
        return random( new Random(), size );
    }

    public static ByteBuf random(Random random, int size) {
        byte[] bytes = new byte[ size ];
        random.nextBytes( bytes );
        return Unpooled.wrappedBuffer(bytes);
    }
}
