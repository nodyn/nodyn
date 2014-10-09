package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import sun.security.util.BigInt;

import java.math.BigInteger;

/**
 * @author Bob McWhirter
 */
public class BigIntegerUtils {

    public static ByteBuf toBuf(BigInteger i) {
        byte[] array = i.toByteArray();
        int byteLen = (int) Math.ceil( i.bitLength() / 8.0  );
        ByteBuf buf = Unpooled.buffer( byteLen );
        buf.writeBytes( array, array.length - byteLen, byteLen );
        return buf;
    }

    public static BigInteger fromBuf(ByteBuf buf) {
        byte[] array = new byte[ buf.readableBytes() + 1 ];
        array[0] = 0;
        buf.getBytes(0, array, 1, buf.readableBytes() );

        return new BigInteger( array );
    }
}
