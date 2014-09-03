package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import org.bouncycastle.crypto.BlockCipher;
import org.bouncycastle.crypto.BufferedBlockCipher;
import org.bouncycastle.crypto.CipherParameters;
import org.bouncycastle.crypto.InvalidCipherTextException;
import org.bouncycastle.crypto.engines.DESEngine;
import org.bouncycastle.crypto.modes.CBCBlockCipher;
import org.bouncycastle.crypto.paddings.PKCS7Padding;
import org.bouncycastle.crypto.paddings.PaddedBufferedBlockCipher;
import org.bouncycastle.crypto.params.KeyParameter;
import org.bouncycastle.crypto.params.ParametersWithIV;

import java.security.InvalidKeyException;

/**
 * @author Bob McWhirter
 */
public class Cipher {

    private BufferedBlockCipher cipher;
    private ByteBuf outBuf;

    public Cipher(boolean encipher, BufferedBlockCipher cipher, ByteBuf key, ByteBuf iv) throws InvalidKeyException {
        this.cipher = cipher;
        this.outBuf = Unpooled.buffer();
        initialize(encipher, key, iv);
    }

    private void initialize(boolean encipher, ByteBuf key, ByteBuf iv) throws InvalidKeyException {
        CipherParameters params = null;

        byte[] keyBytes = new byte[key.readableBytes()];
        key.readBytes(keyBytes);

        params = new KeyParameter(keyBytes);

        if (iv.readableBytes() > 0) {
            byte[] ivBytes = new byte[iv.readableBytes()];
            iv.readBytes(ivBytes);
            params = new ParametersWithIV(params, ivBytes);
        }

        this.cipher.init(encipher, params);
    }

    public void update(ByteBuf buf) {
        byte[] outBytes = new byte[this.cipher.getUpdateOutputSize(buf.readableBytes())];
        byte[] inBytes = new byte[buf.readableBytes()];
        buf.readBytes(inBytes);
        int len = this.cipher.processBytes(inBytes, 0, inBytes.length, outBytes, 0);
        this.outBuf.writeBytes(outBytes, 0, len);
    }

    public ByteBuf doFinal() throws InvalidCipherTextException {
        byte[] outBytes = new byte[this.cipher.getOutputSize(0)];
        int len = this.cipher.doFinal(outBytes, 0);
        this.outBuf.writeBytes(outBytes, 0, len);
        return this.outBuf;
    }

}
