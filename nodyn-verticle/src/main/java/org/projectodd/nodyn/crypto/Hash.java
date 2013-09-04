package org.projectodd.nodyn.crypto;

import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import static org.projectodd.nodyn.crypto.Util.Type;
import org.projectodd.nodyn.crypto.encoders.Encoder;

public class Hash {

    private MessageDigest digest;

    public Hash(String algorithm) {
        try {
            algorithm = Util.formatter(algorithm, Type.HASH);
            this.digest = MessageDigest.getInstance(algorithm);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hash algorithm not found: " + algorithm);
        }
    }

    public void update(String message, String encoding) {
        this.digest.update(message.getBytes(Charset.forName(encoding)));
    }

    public void update(String message) {
        // TODO: The default in node.js, when an encoding is not specified
        // is to assume a Buffer. For now, we'll just default to UTF-8 and
        // see how far that gets us. Soon, I'm sure, we'll need to rip out
        // the Buffer classes from this project and move entirely to using
        // vert.x Buffers.  It is truly amazing that all six lines of this
        // comment have the same number of characters, isn't it?  Amazing! 
        this.update(message, Encoder.DEFAULT_ENCODING.toString());
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
        return encoder.encode(digest.digest());
    }
}
