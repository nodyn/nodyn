package io.nodyn;

import org.junit.Test;

import java.io.UnsupportedEncodingException;
import java.util.Base64;
import java.util.zip.Deflater;

/**
 * @author Lance Ball
 */
public class DeflateTest {
    @Test
    public void testDeflate() throws UnsupportedEncodingException {
        String str = "Now is the winter of our discontent made glorious summer by this Son of York";
        Deflater deflater = new Deflater(Deflater.DEFAULT_COMPRESSION, true);
        deflater.setInput(str.getBytes("UTF-8"));
        deflater.finish();
        byte[] output = new byte[str.length()];
        int compressedLength = deflater.deflate(output);
        deflater.end();
        System.out.println(new String(Base64.getEncoder().encode(output)));
    }
}
