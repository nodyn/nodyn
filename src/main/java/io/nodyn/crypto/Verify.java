package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.CompositeByteBuf;
import io.netty.buffer.Unpooled;
import io.nodyn.buffer.Buffer;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.cms.CMSProcessableByteArray;
import org.bouncycastle.cms.CMSSignedData;
import org.bouncycastle.cms.SignerInformation;
import org.bouncycastle.cms.SignerInformationVerifier;
import org.bouncycastle.cms.jcajce.JcaSimpleSignerInfoVerifierBuilder;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;

import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.security.PublicKey;
import java.util.Iterator;

/**
 * @author Bob McWhirter
 */
public class Verify {

    private CompositeByteBuf data;
    private String algorithm;

    public Verify() {

    }

    public void init(String algorithm) {
        this.algorithm = algorithm;
        this.data = Unpooled.compositeBuffer();
    }

    public void update(ByteBuffer buf) {
        this.data.addComponent(Unpooled.wrappedBuffer(Buffer.extractByteArray(buf)));
        this.data.writerIndex(this.data.writerIndex() + buf.position());
    }

    public boolean verify(ByteBuffer objectBuf, ByteBuffer signature) throws Exception {
        String objectStr = new String(Buffer.extractByteArray(objectBuf), Charset.forName("UTF-8"));
        Reader objectReader = new StringReader(objectStr);
        PEMParser parser = new PEMParser(objectReader);
        PublicKey publicKey = null;
        try {
            Object object = parser.readObject();


            JcaPEMKeyConverter converter = new JcaPEMKeyConverter();

            if (object instanceof SubjectPublicKeyInfo) {
                publicKey = converter.getPublicKey((SubjectPublicKeyInfo) object);
            } else if (object instanceof PEMKeyPair) {
                publicKey = converter.getKeyPair((PEMKeyPair) object).getPublic();
            } else {
                throw new Exception("Invalid public key" );
            }
        } catch (IOException e) {
            throw new Exception( "Invalid public key" );
        }

        try {
            byte[] dataBytes = new byte[this.data.readableBytes()];
            this.data.getBytes(this.data.readerIndex(), dataBytes);
            CMSProcessableByteArray message = new CMSProcessableByteArray(dataBytes);

            byte[] signatureBytes = Buffer.extractByteArray(signature);

            CMSSignedData signedData = new CMSSignedData(message, signatureBytes);

            SignerInformationVerifier verifier = new JcaSimpleSignerInfoVerifierBuilder().build(publicKey);

            Iterator<SignerInformation> signerIter = signedData.getSignerInfos().getSigners().iterator();

            while (signerIter.hasNext()) {
                SignerInformation each = signerIter.next();
                if (each.verify(verifier)) {
                    return true;
                }
            }

            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
