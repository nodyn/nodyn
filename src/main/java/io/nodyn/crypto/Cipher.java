package io.nodyn.crypto;

import java.nio.ByteBuffer;
import org.bouncycastle.crypto.BufferedBlockCipher;
import org.bouncycastle.crypto.CipherParameters;
import org.bouncycastle.crypto.InvalidCipherTextException;
import org.bouncycastle.crypto.params.KeyParameter;
import org.bouncycastle.crypto.params.ParametersWithIV;

import java.security.InvalidKeyException;
import java.util.ArrayList;

/**
 * @author Bob McWhirter
 */
public class Cipher {

    private BufferedBlockCipher cipher;
    private ArrayList<ByteBuffer> outBuf = new ArrayList<>();
    private int outLen;

    public Cipher(boolean encipher, BufferedBlockCipher cipher, ByteBuffer key, ByteBuffer iv) throws InvalidKeyException {
        this.cipher = cipher;
        initialize(encipher, key, iv);
    }

    private void initialize(boolean encipher, ByteBuffer key, ByteBuffer iv) throws InvalidKeyException {
        CipherParameters params = null;
        final int originalPosition = key.position();
        byte[] keyBytes = new byte[originalPosition];
        key.position(0);
        key.get(keyBytes);
        key.position(originalPosition);
        params = new KeyParameter(keyBytes);

        if (iv.position() > 0) {
            final int ivPosition = iv.position();
            byte[] ivBytes = new byte[ivPosition];
            iv.position(0);
            iv.get(ivBytes);
            iv.position(ivPosition);
            params = new ParametersWithIV(params, ivBytes);
        }

        this.cipher.init(encipher, params);
    }

    public void update(ByteBuffer buf) {
        final int pos = buf.position();
        buf.position(0);
        byte[] outBytes = new byte[this.cipher.getUpdateOutputSize(pos)];
        byte[] inBytes = new byte[pos];
        buf.get(inBytes);
        buf.position(pos);
        int len = this.cipher.processBytes(inBytes, 0, inBytes.length, outBytes, 0);
        ByteBuffer out = ByteBuffer.allocate(len);
        out.put(outBytes, 0, len);
        this.outBuf.add(out);
        outLen += len;
    }

    public ByteBuffer doFinal() throws InvalidCipherTextException {
        byte[] outBytes = new byte[this.cipher.getOutputSize(0)];
        int len = this.cipher.doFinal(outBytes, 0);
        ByteBuffer fnl = ByteBuffer.allocate(len);
        fnl.put(outBytes, 0, len);
        this.outBuf.add(fnl);
        outLen += len;
        ByteBuffer out = ByteBuffer.allocate(outLen);
        for(ByteBuffer b : outBuf) {
            b.position(0);
            out.put(b);
        }
        return out;
    }

}
