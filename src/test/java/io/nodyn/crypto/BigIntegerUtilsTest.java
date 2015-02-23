package io.nodyn.crypto;

import org.junit.Test;

import java.math.BigInteger;
import java.nio.ByteBuffer;
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
        ByteBuffer buf = BigIntegerUtils.toBuf( i );
        assertEquals( hex.length() / 2, buf.position() );
        BigInteger i2 = BigIntegerUtils.fromBuf( buf );
        assertEquals( i, i2 );
    }
}
