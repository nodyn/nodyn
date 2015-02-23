package io.nodyn.crypto;

import java.math.BigInteger;
import java.nio.ByteBuffer;

/**
 * @author Bob McWhirter
 */
public class BigIntegerUtils {

    public static ByteBuffer toBuf(BigInteger i) {
        byte[] array = i.toByteArray();
        int byteLen = (int) Math.ceil( i.bitLength() / 8.0  );
        ByteBuffer buf = ByteBuffer.allocate( byteLen );
        buf.put( array, array.length - byteLen, byteLen );
        return buf;
    }

    public static BigInteger fromBuf(ByteBuffer buf) {
        byte[] array = new byte[ buf.position() + 1 ];
        array[0] = 0;
        buf.position(0);
        buf.get( array, 1, array.length-1 );
        buf.position( array.length-1 );
        return new BigInteger( array );
    }
}
