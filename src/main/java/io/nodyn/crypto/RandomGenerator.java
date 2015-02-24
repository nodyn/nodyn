package io.nodyn.crypto;

import java.nio.ByteBuffer;

import java.security.SecureRandom;
import java.util.Random;

/**
 * @author Bob McWhirter
 */
public class RandomGenerator {

    public static ByteBuffer random(int size) {
        return random( new SecureRandom(), size );
    }

    public static ByteBuffer pseudoRandom(int size) {
        return random( new Random(), size );
    }

    public static ByteBuffer random(Random random, int size) {
        byte[] bytes = new byte[ size ];
        random.nextBytes( bytes );
        ByteBuffer out = ByteBuffer.allocate( bytes.length );
        out.put( bytes );
        return out;
    }
}
