package org.projectodd.nodej.crypto;

import org.projectodd.nodej.crypto.encoders.Encoder;

public class Util {

    public enum Type { HASH, HMAC };

    // Translate algorithm names between Node.js and Java
    public static String formatter(String algorithm, Type type) {

        algorithm = algorithm.toLowerCase();

        switch (type) {
            case HASH:
                return algorithm.replaceFirst("sha", "$0-");
            case HMAC:
                return String.format("Hmac%s", algorithm);
        }

        throw new RuntimeException("Could not a formatter to the algorithm specified");
    }

    public static Encoder encoderFor(String nodeName) {
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