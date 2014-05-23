package org.projectodd.nodyn.crypto;

import org.projectodd.nodyn.crypto.encoders.Encoder;

public class Util {

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
