package org.projectodd.nodyn.buffer;

import java.io.UnsupportedEncodingException;

/**
 * @author Bob McWhirter
 */
public class Helper {

    public static byte[] newByteArray(int len) {
        return new byte[len];
    }

    public static byte[] bytes(String string, String enc) throws UnsupportedEncodingException {
        byte[] bytes = string.getBytes(enc);
        return bytes;
    }

    public static char[] characters(String string) throws UnsupportedEncodingException {
        return string.toCharArray();
    }

}
