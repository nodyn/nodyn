package io.nodyn.crypto;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * @author Bob McWhirter
 */
public class OpenSSLKDFTest {

    @Test
    public void testGeneration() {
        OpenSSLKDF kdf = new OpenSSLKDF("tacos".getBytes(), 8, 8);
        byte[] key = kdf.key();

        assertEquals(key[0] & 0xff, 0xda);
        assertEquals(key[1] & 0xff, 0xce);
        assertEquals(key[2] & 0xff, 0xdf);
        assertEquals(key[3] & 0xff, 0x41);
        assertEquals(key[4] & 0xff, 0x21);
        assertEquals(key[5] & 0xff, 0x04);
        assertEquals(key[6] & 0xff, 0x44);
        assertEquals(key[7] & 0xff, 0xfe);

        byte[] iv = kdf.iv();

        assertEquals(iv[0] & 0xff, 0x85);
        assertEquals(iv[1] & 0xff, 0x47);
        assertEquals(iv[2] & 0xff, 0xf5);
        assertEquals(iv[3] & 0xff, 0xb1);
        assertEquals(iv[4] & 0xff, 0xcf);
        assertEquals(iv[5] & 0xff, 0x08);
        assertEquals(iv[6] & 0xff, 0x5a);
        assertEquals(iv[7] & 0xff, 0x6c);


    }
}
