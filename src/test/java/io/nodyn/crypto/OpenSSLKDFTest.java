package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import java.nio.ByteBuffer;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * @author Bob McWhirter
 */
public class OpenSSLKDFTest {

    @Test
    public void testGeneration() {
        final String cleartxt = "tacos";
        final byte[] bytes = cleartxt.getBytes();
        ByteBuffer password = ByteBuffer.allocate(bytes.length);
        password.put( bytes );
        OpenSSLKDF kdf = new OpenSSLKDF(password, 64, 8);

        ByteBuffer key = kdf.getKey();

        assertEquals(key.get(0) & 0xff, 0xda);
        assertEquals(key.get(1) & 0xff, 0xce);
        assertEquals(key.get(2) & 0xff, 0xdf);
        assertEquals(key.get(3) & 0xff, 0x41);
        assertEquals(key.get(4) & 0xff, 0x21);
        assertEquals(key.get(5) & 0xff, 0x04);
        assertEquals(key.get(6) & 0xff, 0x44);
        assertEquals(key.get(7) & 0xff, 0xfe);

        ByteBuffer iv = kdf.getIv();

        assertEquals(iv.get(0) & 0xff, 0x85);
        assertEquals(iv.get(1) & 0xff, 0x47);
        assertEquals(iv.get(2) & 0xff, 0xf5);
        assertEquals(iv.get(3) & 0xff, 0xb1);
        assertEquals(iv.get(4) & 0xff, 0xcf);
        assertEquals(iv.get(5) & 0xff, 0x08);
        assertEquals(iv.get(6) & 0xff, 0x5a);
        assertEquals(iv.get(7) & 0xff, 0x6c);


    }
}
