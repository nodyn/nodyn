package io.nodyn.buffer;

import java.nio.charset.Charset;

/**
 * @author Bob McWhirter
 */
public class Internal {

    private static final Charset UTF8 = Charset.forName( "utf8" );

    public static int byteLength(String str, String encoding) {
        if ( encoding == null ) {
            encoding = "utf8";
        }
        encoding = encoding.toLowerCase();
        if ( encoding.equals( "utf8" ) ) {
            return str.getBytes(UTF8).length;
        }

        return str.getBytes().length;
    }
}
