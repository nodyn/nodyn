package org.projectodd.nodyn.crypto;

import org.projectodd.nodyn.crypto.encoders.Encoder;
import static org.projectodd.nodyn.crypto.Util.Type;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.Charset;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

public class Hmac {

    private final Mac hmac;

    public Hmac(String algorithm, String key) {
        try {
            algorithm = Util.formatter(algorithm, Type.HMAC);
            this.hmac = Mac.getInstance(algorithm);
            computeKey(algorithm, key);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hmac algorithm not found: " + algorithm);
        } catch (InvalidKeyException e) {
            throw new RuntimeException("Invalid key: " + algorithm);
        }
    }

    private void computeKey(String algorithm, String key) throws InvalidKeyException {
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), algorithm);
        this.hmac.init(secretKey);
    }

    public void update(String message, String encoding) {
        this.hmac.update(message.getBytes(Charset.forName(encoding)));
    }

    public void update(String message) {
        // TODO: The default in node.js, when an encoding is not specified
        // is to assume a Buffer. For now, we'll just default to UTF-8 and
        // see how far that gets us. Soon, I'm sure, we'll need to rip out
        // the Buffer classes from this project and move entirely to using
        // vert.x Buffers.  It is truly amazing that all six lines of this
        // comment have the same number of characters, isn't it?  Amazing!
        this.update(message, "UTF-8");
    }

    public String digest() throws NoSuchAlgorithmException {
        // TODO: The default in node.js, when an encoding is not specified
        // is to return a Buffer. See above.
        return this.digest(Encoder.RAW);
    }

    public String digest(String encoding) throws NoSuchAlgorithmException {
        return this.digest(Util.encoderFor(encoding));
    }

    public String digest(Encoder encoder) throws NoSuchAlgorithmException {
        return encoder.encode(hmac.doFinal());
    }
}
