package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.CompositeByteBuf;
import io.netty.buffer.Unpooled;
import io.nodyn.buffer.Buffer;
import java.nio.ByteBuffer;
import org.bouncycastle.crypto.BufferedBlockCipher;
import org.bouncycastle.crypto.CipherParameters;
import org.bouncycastle.crypto.InvalidCipherTextException;
import org.bouncycastle.crypto.params.KeyParameter;
import org.bouncycastle.crypto.params.ParametersWithIV;

import java.security.InvalidKeyException;

/**
 * @author Bob McWhirter
 */
public class Cipher {

    private final BufferedBlockCipher cipher;
    private final CompositeByteBuf data;

    public Cipher(boolean encipher, BufferedBlockCipher cipher, ByteBuffer key, ByteBuffer iv) throws InvalidKeyException {
        this.cipher = cipher;
        this.data = Unpooled.compositeBuffer();
        initialize(encipher, key, iv);
    }

    private void initialize(boolean encipher, ByteBuffer key, ByteBuffer iv) throws InvalidKeyException {
        CipherParameters params = null;
        byte[] keyBytes = Buffer.extractByteArray(key);
        params = new KeyParameter(keyBytes);

        if (iv.position() > 0) {
            params = new ParametersWithIV(params, Buffer.extractByteArray(iv));
        }

        this.cipher.init(encipher, params);
    }

    public void update(ByteBuffer buf) {
        byte[] inBytes = Buffer.extractByteArray( buf );
        byte[] outBytes = new byte[this.cipher.getUpdateOutputSize(inBytes.length)];
        int len = this.cipher.processBytes(inBytes, 0, inBytes.length, outBytes, 0);
        ByteBuf update = Unpooled.wrappedBuffer(outBytes, 0, len);
        this.data.addComponent(update);
        this.data.writerIndex(this.data.writerIndex()+len);
    }

    public ByteBuffer doFinal() throws InvalidCipherTextException {
        byte[] outBytes = new byte[this.cipher.getOutputSize(0)];
        int len = this.cipher.doFinal(outBytes, 0);
        this.data.addComponent(Unpooled.wrappedBuffer(outBytes));
        this.data.writerIndex(this.data.writerIndex()+len);
        byte[] dataOut = new byte[this.data.readableBytes()];
        this.data.readBytes(dataOut);
        ByteBuffer out =  ByteBuffer.wrap(dataOut);
        out.position(dataOut.length);
        return out;
    }

}
