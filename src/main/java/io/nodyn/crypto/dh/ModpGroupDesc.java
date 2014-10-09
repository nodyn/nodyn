package io.nodyn.crypto.dh;

import javax.crypto.spec.DHParameterSpec;
import java.math.BigInteger;
import java.security.*;

/**
 * @author Bob McWhirter
 */
public class ModpGroupDesc extends DiffieHellmanGroupDesc {

    private final BigInteger p;
    private final BigInteger g;
    private final String name;

    public ModpGroupDesc(String name, BigInteger p, BigInteger g) {
        this.name = name;
        this.p = p;
        this.g = g;
    }

    public BigInteger getP() {
        return this.p;
    }

    public BigInteger getG() {
        return this.g;
    }

    public KeyPair generateKeys() throws NoSuchAlgorithmException, InvalidAlgorithmParameterException, NoSuchProviderException {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("DH", "BC");
        DHParameterSpec paramSpec = new DHParameterSpec(this.p, this.g);

        generator.initialize( paramSpec );

        return generator.generateKeyPair();
    }

}
