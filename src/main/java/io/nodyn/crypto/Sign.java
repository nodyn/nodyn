package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.CompositeByteBuf;
import io.netty.buffer.Unpooled;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.cms.*;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.DigestCalculatorProvider;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;

import java.io.Reader;
import java.io.StringReader;
import java.nio.charset.Charset;
import java.security.KeyPair;
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

    public void update(ByteBuf buf) {
        this.data.addComponent(buf);
        this.data.writerIndex(this.data.writerIndex() + buf.writerIndex());
    }

    public ByteBuf sign(ByteBuf privateKeyBuf, String passphrase) throws Exception {
        String privateKeyStr = privateKeyBuf.toString(Charset.forName("utf8"));
        Reader privateKeyReader = new StringReader( privateKeyStr );
        PEMParser parser = new PEMParser(privateKeyReader);
        Object object = parser.readObject();

        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        PrivateKey privateKey = null;

        if ( object instanceof PrivateKeyInfo ) {
            privateKey = converter.getPrivateKey((PrivateKeyInfo) object);
        } else if ( object instanceof PEMKeyPair ) {
            privateKey = converter.getKeyPair((PEMKeyPair) object).getPrivate();
        } else {
            throw new Exception( "Key is invalid private key" );
        }

        CMSSignedDataGenerator generator = new CMSSignedDataGenerator();

        ContentSigner signer = new JcaContentSignerBuilder(this.algorithm).build(privateKey);

        DigestCalculatorProvider digest = new JcaDigestCalculatorProviderBuilder().build();
        SignerInfoGenerator signerInfo = new SignerInfoGeneratorBuilder(digest).build(signer, new byte[]{0});

        generator.addSignerInfoGenerator(signerInfo);

        byte[] dataBytes = new byte[ this.data.readableBytes() ];
        this.data.getBytes( this.data.readerIndex(), dataBytes );
        CMSProcessableByteArray message = new CMSProcessableByteArray(dataBytes);

        CMSSignedData sigData = generator.generate(message);
        byte[] sigBytes = sigData.getEncoded();

        return Unpooled.wrappedBuffer( sigBytes );
    }
}
