package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * @author Bob McWhirter
 */
public class OpenSSLKDFTest {

    @Test
    public void testGeneration() {
        ByteBuf password = Unpooled.buffer();
        password.writeBytes( "tacos".getBytes() );
        OpenSSLKDF kdf = new OpenSSLKDF(password, 64, 8);

        ByteBuf key = kdf.getKey();

        assertEquals(key.getByte(0) & 0xff, 0xda);
        assertEquals(key.getByte(1) & 0xff, 0xce);
        assertEquals(key.getByte(2) & 0xff, 0xdf);
        assertEquals(key.getByte(3) & 0xff, 0x41);
        assertEquals(key.getByte(4) & 0xff, 0x21);
        assertEquals(key.getByte(5) & 0xff, 0x04);
        assertEquals(key.getByte(6) & 0xff, 0x44);
        assertEquals(key.getByte(7) & 0xff, 0xfe);

        ByteBuf iv = kdf.getIv();

        assertEquals(iv.getByte(0) & 0xff, 0x85);
        assertEquals(iv.getByte(1) & 0xff, 0x47);
        assertEquals(iv.getByte(2) & 0xff, 0xf5);
        assertEquals(iv.getByte(3) & 0xff, 0xb1);
        assertEquals(iv.getByte(4) & 0xff, 0xcf);
        assertEquals(iv.getByte(5) & 0xff, 0x08);
        assertEquals(iv.getByte(6) & 0xff, 0x5a);
        assertEquals(iv.getByte(7) & 0xff, 0x6c);


    }
}
