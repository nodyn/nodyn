package io.nodyn.crypto;

import java.nio.ByteBuffer;
import org.bouncycastle.crypto.digests.MD5Digest;

/**
 * @author Bob McWhirter
 */
public final class OpenSSLKDF {

    private ByteBuffer key;
    private ByteBuffer iv;

    public OpenSSLKDF(ByteBuffer data, int keyLen, int ivLen) {
        int originalPosition = data.position();
        byte[] bytes = new byte[originalPosition];
        data.position(0);
        data.get(bytes);
        data.position(originalPosition);
        kdf(bytes, keyLen / 8 , ivLen  );
    }

    public ByteBuffer getKey() {
        return this.key;
    }

    public ByteBuffer getIv() {
        return this.iv;
    }

    protected void kdf(byte[] data, int keyLen, int ivLen) {

        int totalLen = keyLen + ivLen;
        int curLen = 0;
        byte[] prev = new byte[0];

        byte[] kiv = new byte[totalLen];
        for (int i = 0; i < totalLen; ++i) {
            kiv[i] = 0;
        }

        while (curLen < totalLen) {
            prev = kdf_d(data, prev, 1);
            for (int i = 0; i < prev.length; ++i) {
                if (curLen < (kiv.length)) {
                    kiv[curLen] = prev[i];
                    ++curLen;
                }
            }
        }

        this.key = ByteBuffer.allocate(keyLen);
        this.iv = ByteBuffer.allocate(ivLen);

        this.key.put(kiv, 0, keyLen);
        this.iv.put(kiv, keyLen, ivLen);
    }

    protected byte[] kdf_d(byte[] data, byte[] prev, int iter) {

        byte[] bytes = new byte[prev.length + data.length];

        for (int i = 0; i < prev.length; ++i) {
            bytes[i] = prev[i];
        }

        for (int i = 0; i < data.length; ++i) {
            bytes[prev.length + i] = data[i];
        }

        byte[] cur = bytes;

        for (int i = 0; i < iter; ++i) {
            MD5Digest digest = new MD5Digest();
            digest.update(cur, 0, cur.length);

            cur = new byte[digest.getDigestSize()];
            digest.doFinal(cur, 0);
        }

        byte[] out = new byte[16];

        for (int i = 0; i < out.length; ++i) {
            out[i] = cur[i];
        }

        return out;
    }


}
