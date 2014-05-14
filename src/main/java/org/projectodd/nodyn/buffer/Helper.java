package org.projectodd.nodyn.buffer;

import org.vertx.java.core.buffer.*;
import org.vertx.java.core.buffer.Buffer;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;

/**
 * @author Bob McWhirter
 */
public class Helper {

    public static byte[] bytes(String string, String enc) throws UnsupportedEncodingException {
        byte[] bytes = string.getBytes(enc);
        return bytes;
    }

}
