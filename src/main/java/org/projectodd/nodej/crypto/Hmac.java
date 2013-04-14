package org.projectodd.nodej.crypto;

import org.projectodd.nodej.crypto.encoders.Encoder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.Charset;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

public class Hmac {

    private final Mac hmac;
    private final SecretKeySpec secretKey;

    public Hmac(String algorithm, String key) {
        try {
            algorithm = formatter(algorithm);
            this.hmac = Mac.getInstance(algorithm);
            this.secretKey = new SecretKeySpec(key.getBytes(), algorithm);
            this.hmac.init(this.secretKey);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hmac algorithm not found: " + algorithm);
        } catch (InvalidKeyException e) {
            throw new RuntimeException("Invalid key: " + algorithm);
        }
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
        return this.digest(Hmac.encoderFor(encoding));
    }

    public String digest(Encoder encoder) throws NoSuchAlgorithmException {
        return encoder.encode(hmac.doFinal());
    }

    // Translate Hmac algorithm names between Node.js and Java
    private static String formatter(String algorithm) {
        return String.format("Hmac%s", algorithm.toLowerCase());
    }

    private static Encoder encoderFor(String nodeName) {
        switch (nodeName) {
            case "binary":
                return Encoder.RAW;
            case "hex":
                return Encoder.HEX;
            case "base64":
                return Encoder.BASE64;
        }
        return Encoder.RAW;
    }
}
