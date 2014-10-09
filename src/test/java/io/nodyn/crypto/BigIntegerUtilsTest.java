package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import org.junit.Test;

import java.math.BigInteger;
import static org.junit.Assert.*;

/**
 * @author Bob McWhirter
 */
public class BigIntegerUtilsTest {

    @Test
    public void testConversion() {
        roundTrip( "FF" );
        roundTrip( "FFFF" );
        roundTrip( "40FF" );
        roundTrip( "FFFF" );
        roundTrip( "80FFFF" );
    }

    protected void roundTrip(String hex) {
        BigInteger i = new BigInteger( hex, 16 );
        ByteBuf buf = BigIntegerUtils.toBuf( i );
        assertEquals( hex.length() / 2, buf.readableBytes() );
        BigInteger i2 = BigIntegerUtils.fromBuf( buf );
        assertEquals( i, i2 );
    }
}
