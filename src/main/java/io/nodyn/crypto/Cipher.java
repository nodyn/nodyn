package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
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

    private final BufferedBlockCipher cipher;
    private ByteBuf outBuf;

    public Cipher(boolean encipher, String cipher, ByteBuf password) throws InvalidKeyException {
        switch ( cipher ) {
            case "des":
                this.cipher = new PaddedBufferedBlockCipher(new CBCBlockCipher( new DESEngine() ), new PKCS7Padding() );
                computeKey(encipher, password, 8, 8);
                break;
            default:
                throw new IllegalArgumentException( "Invalid cipher algorithm: " + cipher );
        }

        this.outBuf = Unpooled.buffer();
    }

    private void computeKey(boolean encipher, ByteBuf key, int keyLen, int ivLen) throws InvalidKeyException {
        byte[] keyBytes = new byte[ key.readableBytes() ];
        key.readBytes( keyBytes );
        OpenSSLKDF kdf = new OpenSSLKDF(keyBytes, keyLen, ivLen);

        KeyParameter keyParam = new KeyParameter(kdf.key());
        CipherParameters param = new ParametersWithIV( keyParam, kdf.iv() );
        this.cipher.init( encipher, param);
    }

    public void update(ByteBuf buf) {
        byte[] outBytes = new byte[ this.cipher.getUpdateOutputSize( buf.readableBytes() ) ];
        byte[] inBytes = new byte[ buf.readableBytes() ];
        buf.readBytes( inBytes );
        int len = this.cipher.processBytes(inBytes, 0, inBytes.length, outBytes, 0);
        this.outBuf.writeBytes( outBytes, 0, len );
    }

    public ByteBuf doFinal() throws InvalidCipherTextException {
        byte[] outBytes = new byte[ this.cipher.getOutputSize(0) ];
        int len = this.cipher.doFinal( outBytes, 0 );
        this.outBuf.writeBytes( outBytes, 0, len );
        return this.outBuf;
    }

}
