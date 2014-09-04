package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;

import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.charset.Charset;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;

/**
 * @author Bob McWhirter
 */
public class PBKDF2 {

    public static ByteBuf pbkdf2(ByteBuf password, ByteBuf salt, int iterations, int keyLen) throws NoSuchAlgorithmException, InvalidKeySpecException {
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");

        char[] passwordChars = password.toString(Charset.forName( "utf8" ) ).toCharArray();

        byte[] saltBytes = new byte[ salt.readableBytes() ];
        salt.readBytes( saltBytes );

        KeySpec keySpec = new PBEKeySpec( passwordChars, saltBytes, iterations, keyLen * 8 );

        SecretKey secretKey = factory.generateSecret(keySpec);

        byte[] keyBytes = secretKey.getEncoded();
        return Unpooled.copiedBuffer( keyBytes );
    }
}
