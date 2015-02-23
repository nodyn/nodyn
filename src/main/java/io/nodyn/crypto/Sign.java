package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.CompositeByteBuf;
import io.netty.buffer.Unpooled;
import io.nodyn.buffer.Buffer;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.cms.*;
import org.bouncycastle.openssl.PEMDecryptorProvider;
import org.bouncycastle.openssl.PEMEncryptedKeyPair;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.openssl.jcajce.JcePEMDecryptorProviderBuilder;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.DigestCalculatorProvider;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;

import java.io.Reader;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.security.PrivateKey;

/**
 * @author Bob McWhirter
 */
public class Sign {

    private CompositeByteBuf data;
    private String algorithm;

    public Sign() {

    }

    public void init(String algorithm) {
        this.algorithm = algorithm;
        this.data = Unpooled.compositeBuffer();
    }

    public void update(ByteBuffer buf) {
        this.data.addComponent(Unpooled.wrappedBuffer(Buffer.extractByteArray(buf)));
        this.data.writerIndex(this.data.writerIndex() + buf.position());
    }

    public ByteBuffer sign(ByteBuffer privateKeyBuf, String passphrase) throws Exception {

        String privateKeyStr = new String(privateKeyBuf.array(), Charset.forName("UTF-8"));
        Reader privateKeyReader = new StringReader(privateKeyStr);
        PEMParser parser = new PEMParser(privateKeyReader);
        Object object = parser.readObject();

        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        PrivateKey privateKey = null;

        if (object instanceof PrivateKeyInfo) {
            privateKey = converter.getPrivateKey((PrivateKeyInfo) object);
        } else if (object instanceof PEMKeyPair) {
            privateKey = converter.getKeyPair((PEMKeyPair) object).getPrivate();
        } else if (object instanceof PEMEncryptedKeyPair) {
            char[] passphraseChars = null;
            if ( passphrase == null ) {
                passphraseChars = new char[]{};
            } else {
                passphraseChars = passphrase.toCharArray();
            }

            PEMDecryptorProvider decryptor = new JcePEMDecryptorProviderBuilder().build(passphraseChars);
            try {
                privateKey = converter.getKeyPair(((PEMEncryptedKeyPair) object).decryptKeyPair(decryptor)).getPrivate();
            } catch (Exception e) {
                throw new Exception( "Invalid passphrase" );
            }

        } else {
            throw new Exception("Key is invalid private key: " + object);
        }

        CMSSignedDataGenerator generator = new CMSSignedDataGenerator();

        ContentSigner signer = new JcaContentSignerBuilder(this.algorithm).build(privateKey);

        DigestCalculatorProvider digest = new JcaDigestCalculatorProviderBuilder().build();
        SignerInfoGenerator signerInfo = new SignerInfoGeneratorBuilder(digest).build(signer, new byte[]{0});

        generator.addSignerInfoGenerator(signerInfo);

        byte[] dataBytes = new byte[this.data.readableBytes()];
        this.data.getBytes(this.data.readerIndex(), dataBytes);
        CMSProcessableByteArray message = new CMSProcessableByteArray(dataBytes);

        CMSSignedData sigData = generator.generate(message);
        byte[] sigBytes = sigData.getEncoded();

        ByteBuffer out = ByteBuffer.wrap(sigBytes);
        out.position(sigBytes.length);
//        System.out.println(out);
        return out;
    }
}
