package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import org.bouncycastle.crypto.digests.MD5Digest;

/**
 * @author Bob McWhirter
 */
public class OpenSSLKDF {

    private ByteBuf key;
    private ByteBuf iv;

    public OpenSSLKDF(ByteBuf data, int keyLen, int ivLen) {
        byte[] bytes = new byte[data.readableBytes()];
        data.readBytes(bytes);
        kdf(bytes, keyLen / 8 , ivLen  );
    }

    public ByteBuf getKey() {
        return this.key;
    }

    public ByteBuf getIv() {
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

        this.key = Unpooled.buffer(keyLen);
        this.iv = Unpooled.buffer(ivLen);

        this.key.writeBytes(kiv, 0, keyLen);
        this.iv.writeBytes(kiv, keyLen, ivLen);
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
