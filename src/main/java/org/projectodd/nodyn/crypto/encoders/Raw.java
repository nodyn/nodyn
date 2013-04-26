package org.projectodd.nodyn.crypto.encoders;

public class Raw implements Encoder {

    public byte[] decode(final String data) {
        return data != null ? data.getBytes(DEFAULT_ENCODING) : null;
    }

    @Override
    public String encode(byte[] data) {
        return data != null ? new String(data, DEFAULT_ENCODING) : null;
    }
}
