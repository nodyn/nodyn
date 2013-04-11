package org.projectodd.nodej.crypto.encoders;

public class Raw implements Encoder {

    public byte[] decode(final String data) {
        return data != null ? data.getBytes(CHARSET) : null;
    }

    @Override
    public String encode(byte[] data) {
        return data != null ? new String(data, CHARSET) : null;
    }
}
