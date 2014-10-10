package io.nodyn.crypto.dh;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.nodyn.crypto.BigIntegerUtils;

import javax.crypto.KeyAgreement;
import javax.crypto.interfaces.DHPrivateKey;
import javax.crypto.interfaces.DHPublicKey;
import javax.crypto.spec.DHPrivateKeySpec;
import javax.crypto.spec.DHPublicKeySpec;
import java.math.BigInteger;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.util.Random;

/**
 * @author Bob McWhirter
 */
public class DiffieHellman {

    private final DiffieHellmanGroupDesc desc;
    private KeyPair keys;

    public DiffieHellman(int keySize, int g) {
        this(new BigInteger(keySize, 500, new Random()), g);
    }

    public DiffieHellman(ByteBuf p, int g) {
        this(BigIntegerUtils.fromBuf(p), g);
    }

    public DiffieHellman(String name) {
        this.desc = DiffieHellmanGroupDesc.get(name);
    }

    DiffieHellman(BigInteger p, int g) {
        this.desc = new ModpGroupDesc(null, p, new BigInteger("" + g));
    }

    public ByteBuf getPrime() {
        return BigIntegerUtils.toBuf(this.desc.getP());
    }

    public ByteBuf getGenerator() {
        return BigIntegerUtils.toBuf(this.desc.getG());
    }

    public ByteBuf generateKeys() throws InvalidAlgorithmParameterException, NoSuchAlgorithmException, NoSuchProviderException {
        this.keys = this.desc.generateKeys();
        return getPublicKey();
    }

    public void setPublicKey(ByteBuf keyBuf) throws NoSuchProviderException, NoSuchAlgorithmException, InvalidKeySpecException {
        BigInteger y = BigIntegerUtils.fromBuf( keyBuf );

        DHPublicKeySpec keySpec = new DHPublicKeySpec(y, this.desc.getP(), this.desc.getG());

        KeyFactory keyFactory = KeyFactory.getInstance("DH", "BC");
        PublicKey publicKey = keyFactory.generatePublic(keySpec);

        if ( this.keys == null ) {
            this.keys = new KeyPair( publicKey, null );
        } else {
            this.keys = new KeyPair( publicKey, this.keys.getPrivate() );
        }
    }

    public ByteBuf getPublicKey() {
        BigInteger y = ((DHPublicKey) this.keys.getPublic()).getY();
        return BigIntegerUtils.toBuf(y);
    }

    public void setPrivateKey(ByteBuf keyBuf) throws NoSuchProviderException, NoSuchAlgorithmException, InvalidKeySpecException {
        BigInteger x = BigIntegerUtils.fromBuf( keyBuf );

        DHPrivateKeySpec keySpec = new DHPrivateKeySpec(x, this.desc.getP(), this.desc.getG());

        KeyFactory keyFactory = KeyFactory.getInstance("DH", "BC");
        PrivateKey privateKey = keyFactory.generatePrivate(keySpec);

        if ( this.keys == null ) {
            this.keys = new KeyPair( null, privateKey );
        } else {
            this.keys = new KeyPair( this.keys.getPublic(), privateKey );
        }
    }

    public ByteBuf getPrivateKey() {
        BigInteger y = ((DHPrivateKey) this.keys.getPrivate()).getX();
        return BigIntegerUtils.toBuf(y);
    }

    public ByteBuf computeSecret(ByteBuf publicKeyBytes) throws NoSuchAlgorithmException, InvalidKeySpecException, InvalidKeyException, NoSuchProviderException {
        BigInteger y = BigIntegerUtils.fromBuf(publicKeyBytes);

        DHPublicKeySpec keySpec = new DHPublicKeySpec(y, this.desc.getP(), this.desc.getG());

        KeyFactory keyFactory = KeyFactory.getInstance("DH", "BC");
        PublicKey publicKey = keyFactory.generatePublic(keySpec);

        KeyAgreement agreement = KeyAgreement.getInstance("DH");

        agreement.init(this.keys.getPrivate());
        agreement.doPhase(publicKey, true);

        byte[] secret = agreement.generateSecret();

        return Unpooled.wrappedBuffer(secret);
    }
}
