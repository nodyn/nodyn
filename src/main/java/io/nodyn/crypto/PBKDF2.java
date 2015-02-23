package io.nodyn.crypto;

import io.nodyn.buffer.Buffer;
import java.nio.ByteBuffer;

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

    public static ByteBuffer pbkdf2(ByteBuffer password, ByteBuffer salt, int iterations, int keyLen) throws NoSuchAlgorithmException, InvalidKeySpecException {
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");

        char[] passwordChars = new String(Buffer.extractByteArray(password), Charset.forName("UTF-8")).toCharArray();

        byte[] saltBytes = Buffer.extractByteArray(salt);

        KeySpec keySpec = new PBEKeySpec( passwordChars, saltBytes, iterations, keyLen * 8 );

        SecretKey secretKey = factory.generateSecret(keySpec);

        byte[] keyBytes = secretKey.getEncoded();
        ByteBuffer out = ByteBuffer.allocate(keyBytes.length);
        out.put(keyBytes);
        return out;
    }
}
