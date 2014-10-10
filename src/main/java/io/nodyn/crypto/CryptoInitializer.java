package io.nodyn.crypto;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.io.File;
import java.lang.reflect.Constructor;
import java.security.Provider;
import java.security.Security;

/**
 * @author Bob McWhirter
 */
public class CryptoInitializer {

    public static void initialize() {
        // because Fedora is hobbled...
        try {
            Class<Provider> providerClass = (Class<Provider>) Class.forName("sun.security.pkcs11.SunPKCS11");
            File configFile = new File(System.getProperty("java.home"));
            configFile = new File(configFile, "lib");
            configFile = new File(configFile, "security");
            configFile = new File(configFile, "nss.cfg");
            Constructor<Provider> constructor = providerClass.getConstructor(String.class);
            Provider provider = constructor.newInstance(configFile.getAbsolutePath());
            Security.addProvider(provider);
        } catch (Throwable t) {
            // apparently not do-able, things may behave strangely.
        }

        // because JDK Diffie-Hellman is hobbled...
        Security.addProvider(new BouncyCastleProvider());
    }
}
