package org.projectodd.nodyn.crypto;

/**
 * @author Bob McWhirter
 */
public class CryptoHelper {

    public static char[] characters(byte[] bytes) {
        char[] chars = new char[ bytes.length ];
        for ( int i = 0 ; i < bytes.length ; ++i ) {
            chars[i] = (char) bytes[i];
        }
        return chars;
    }
}
