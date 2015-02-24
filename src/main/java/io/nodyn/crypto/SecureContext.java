package io.nodyn.crypto;

import io.nodyn.buffer.Buffer;
import io.nodyn.tls.CipherList;
import java.io.ByteArrayInputStream;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.openssl.PEMDecryptorProvider;
import org.bouncycastle.openssl.PEMEncryptedKeyPair;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.openssl.jcajce.JcePEMDecryptorProviderBuilder;

import javax.net.ssl.*;
import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Bob McWhirter
 */
public class SecureContext {



    private SSLContext sslContext;

    private PrivateKey privateKey;
    private String ciphers;
    private String sessionIdContext;
    private Object ecdhCurve;
    private Certificate cert;

    private List<Certificate> caCerts = new ArrayList<>();
    private List<Certificate> rootCerts = new ArrayList<>();

    public SecureContext() throws KeyStoreException, CertificateException, NoSuchAlgorithmException, IOException {
    }

    public void init(String secureProtocol) throws NoSuchAlgorithmException, NoSuchProviderException {
        if (secureProtocol == null) {
            secureProtocol = "TLS";
        }
        this.sslContext = SSLContext.getInstance(secureProtocol);
    }

    public SSLEngine getSSLEngine() throws Exception {
        KeyStore keyStore = initKeyStore();

        KeyManager[] km = initKeyManagers(keyStore);
        TrustManager[] tm = initTrustManagers(keyStore);

        this.sslContext.init(km, tm, null);
        SSLEngine engine = this.sslContext.createSSLEngine( "localhost", 0);
        SSLParameters params = new SSLParameters();
        engine.setSSLParameters( params );
        engine.setEnabledCipherSuites( new CipherList( engine.getSupportedCipherSuites(), this.ciphers).toArray() );
        return engine;
    }

    protected KeyStore initKeyStore() throws Exception {
        KeyStore keyStore = KeyStore.getInstance("JKS");
        keyStore.load(null);

        if (this.cert != null) {
            keyStore.setCertificateEntry("cert", this.cert);
        }

        if (this.privateKey != null) {
            keyStore.setKeyEntry("key", this.privateKey, "".toCharArray(), new Certificate[]{this.cert});
        }

        int counter = 0;

        for (Certificate each : this.rootCerts) {
            keyStore.setCertificateEntry("root-" + (++counter), each);
        }

        counter = 0;

        for (Certificate each : this.caCerts) {
            keyStore.setCertificateEntry("ca-" + (++counter), each);
        }

        return keyStore;
    }

    protected KeyManager[] initKeyManagers(KeyStore keyStore) throws UnrecoverableKeyException, NoSuchAlgorithmException, KeyStoreException {
        KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
        kmf.init(keyStore, "".toCharArray());
        return kmf.getKeyManagers();
    }

    protected TrustManager[] initTrustManagers(KeyStore keyStore) throws KeyStoreException, NoSuchAlgorithmException {
        TrustManagerFactory tmf = TrustManagerFactory.getInstance("Sunx509");
        tmf.init(keyStore);
        return tmf.getTrustManagers();
    }

    public void setKey(ByteBuffer privateKeyBuf, String passphrase) throws Exception {
        String privateKeyStr = new String(Buffer.extractByteArray(privateKeyBuf), Charset.forName("UTF-8"));
        Reader privateKeyReader = new StringReader(privateKeyStr);
        PEMParser parser = new PEMParser(privateKeyReader);
        Object object = parser.readObject();

        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();

        if (object instanceof PrivateKeyInfo) {
            this.privateKey = converter.getPrivateKey((PrivateKeyInfo) object);
        } else if (object instanceof PEMKeyPair) {
            this.privateKey = converter.getKeyPair((PEMKeyPair) object).getPrivate();
        } else if (object instanceof PEMEncryptedKeyPair) {
            char[] passphraseChars = null;
            if (passphrase == null) {
                passphraseChars = new char[]{};
            } else {
                passphraseChars = passphrase.toCharArray();
            }

            PEMDecryptorProvider decryptor = new JcePEMDecryptorProviderBuilder().build(passphraseChars);
            try {
                this.privateKey = converter.getKeyPair(((PEMEncryptedKeyPair) object).decryptKeyPair(decryptor)).getPrivate();
            } catch (Exception e) {
                throw new Exception("Invalid passphrase");
            }

        } else {
            throw new Exception("Key is invalid private key: " + object);
        }

    }

    public void setCert(ByteBuffer certBuf) throws IOException, CertificateException {
        ByteArrayInputStream certIn = new ByteArrayInputStream(certBuf.array());
        CertificateFactory factory = CertificateFactory.getInstance("X.509");
        this.cert = factory.generateCertificate(certIn);
    }

    public void addCACert(ByteBuffer certBuf) throws IOException, CertificateException {
        ByteArrayInputStream certIn = new ByteArrayInputStream(certBuf.array());
        CertificateFactory factory = CertificateFactory.getInstance("X.509");
        this.caCerts.add(factory.generateCertificate(certIn));
    }

    public void addRootCert(ByteBuffer certBuf) throws IOException, CertificateException {
        ByteArrayInputStream certIn = new ByteArrayInputStream(certBuf.array());
        CertificateFactory factory = CertificateFactory.getInstance("X.509");
        this.rootCerts.add(factory.generateCertificate(certIn));
    }

    public void setCiphers(String ciphers) {
        this.ciphers = ciphers;
    }

    public void setSessionIdContext(String sessionIdContext) {
        this.sessionIdContext = sessionIdContext;
    }

    public void setECDHCurve(Object ecdhCurve) {
        this.ecdhCurve = ecdhCurve;
    }

}
