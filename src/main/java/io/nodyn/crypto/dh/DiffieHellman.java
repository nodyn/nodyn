package io.nodyn.crypto.dh;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.nodyn.crypto.BigIntegerUtils;

import javax.crypto.KeyAgreement;
import javax.crypto.interfaces.DHPublicKey;
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

    public ByteBuf generateKeys() throws InvalidAlgorithmParameterException, NoSuchAlgorithmException, NoSuchProviderException {
        this.keys = this.desc.generateKeys();
        return getPublicKey();
    }

    public ByteBuf getPublicKey() {
        BigInteger y = ((DHPublicKey) this.keys.getPublic()).getY();
        return BigIntegerUtils.toBuf( y );
    }

    public ByteBuf computeSecret(ByteBuf publicKeyBytes) throws NoSuchAlgorithmException, InvalidKeySpecException, InvalidKeyException, NoSuchProviderException {
        BigInteger y = BigIntegerUtils.fromBuf( publicKeyBytes );

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
