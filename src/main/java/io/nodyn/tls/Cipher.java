package io.nodyn.tls;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

/**
 * @author Bob McWhirter
 */
public class Cipher {

    public static List<Cipher> CIPHERS = new ArrayList<>();
    public static Map<String, Cipher> CIPHERS_BY_TLSNAME = new HashMap<>();

    static {
        try {
            loadCiphers();
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    public static void loadCiphers() throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(io.nodyn.tls.Cipher.class.getClassLoader().getResourceAsStream("ciphers.txt")));

        String line = null;
        while ((line = in.readLine()) != null) {
            processCipherLine(line);
        }
    }

    public static void processCipherLine(String line) {
        StringTokenizer tokens = new StringTokenizer(line);

        String code = tokens.nextToken();
        tokens.nextToken(); // ignore dash
        String name = tokens.nextToken();
        String protocolVersion = tokens.nextToken();
        String keyExchange = tokens.nextToken();
        String auth = tokens.nextToken();
        String encryptionKeySize = tokens.nextToken();
        String mac = tokens.nextToken();

        Protocol protocol = null;

        if (protocolVersion.startsWith("SSL")) {
            protocol = Protocol.SSL;
        } else if (protocolVersion.startsWith("TLS")) {
            protocol = Protocol.TLS;
        }

        String version = null;

        int vLoc = protocolVersion.indexOf('v');
        if (vLoc > 0) {
            version = protocolVersion.substring(vLoc + 1);
        }

        boolean export = false;

        if (tokens.hasMoreTokens()) {
            export = true;
        }

        String encryption = null;
        int keySize = 0;

        encryptionKeySize = encryptionKeySize.substring(4);

        if (!encryptionKeySize.equals("None")) {
            int leftParenLoc = encryptionKeySize.indexOf('(');
            encryption = encryptionKeySize.substring(0, leftParenLoc);
            String keySizeStr = encryptionKeySize.substring(leftParenLoc + 1, encryptionKeySize.length() - 1);
            keySize = Integer.parseInt(keySizeStr);
        }


        auth = auth.substring(3);
        if (auth.equals("None")) {
            auth = null;
        }
        mac = mac.substring(4);
        keyExchange = keyExchange.substring(3);
        Cipher cipher = new Cipher(code, name, protocol, version, keyExchange, auth, encryption, keySize, mac, export);

        CIPHERS.add(cipher);
        if ( cipher.name != null ) {
            CIPHERS_BY_TLSNAME.put( cipher.name.toUpperCase(), cipher );
        }
    }

    public static enum Protocol {
        SSL,
        TLS
    }

    public final String code;
    public final String opensslName;
    public final String name;
    public final Protocol protocol;
    public final String version;
    public final String keyExchange;
    public final String auth;
    public final String encryption;
    public final int keySize;
    public final String mac;
    public final boolean export;

    public Cipher(String code, String opensslName, Protocol protocol, String version, String keyExchange, String auth, String encryption, int keySize, String mac, boolean export) {
        this.code = code;
        this.name = TLSNames.lookup(code);
        this.opensslName = opensslName;
        this.protocol = protocol;
        this.version = version;
        this.keyExchange = keyExchange;
        this.auth = auth;
        this.encryption = encryption;
        this.keySize = keySize;
        this.mac = mac;
        this.export = export;
    }

    public String toString() {
        return "[Cipher: code=" + this.code + "; name=" + this.name + "; opensslName=" + this.opensslName + "; protocol=" + this.protocol + "; version=" + this.version + "; keyExchange=" + keyExchange + "; auth=" + this.auth + "; encryption=" + this.encryption + "; keySize=" + this.keySize + "; mac=" + this.mac + "; exports=" + this.export + "]";
    }


    public static Cipher getByTLSName(String name) {
        return CIPHERS_BY_TLSNAME.get( name.toUpperCase() );
    }

    public static interface MatchFunction {
        boolean matches(Cipher cipher);
    }

    public static MatchFunction TRUE = new MatchFunction() {
        public boolean matches(Cipher cipher) {
            return true;
        }
    };

    public static MatchFunction FALSE = new MatchFunction() {
        public boolean matches(Cipher cipher) {
            return false;
        }
    };

    public static MatchFunction AND(final MatchFunction left, final MatchFunction right) {
        return new MatchFunction() {
            public boolean matches(Cipher cipher) {
                if (!left.matches(cipher)) {
                    return false;
                }

                return right.matches(cipher);
            }
        };
    }

    public static MatchFunction OR(final MatchFunction left, final MatchFunction right) {
        return new MatchFunction() {
            public boolean matches(Cipher cipher) {
                if (left.matches(cipher)) {
                    return true;
                }

                return right.matches(cipher);
            }
        };
    }

    public static MatchFunction NOT(final MatchFunction f) {
        return new MatchFunction() {
            @Override
            public boolean matches(Cipher cipher) {
                return !f.matches(cipher);
            }
        };
    }


    public static List<Cipher> get(MatchFunction f) {
        List<Cipher> matched = new ArrayList<>();
        for (Cipher each : CIPHERS) {
            if (f.matches(each)) {
                matched.add(each);
            }
        }
        return matched;
    }

    public static MatchFunction EXPORT(final int keySize) {
        return AND(new MatchFunction() {
            public boolean matches(Cipher cipher) {
                return cipher.export;
            }
        }, new MatchFunction() {
            public boolean matches(Cipher cipher) {
                if (keySize < 0) {
                    return true;
                }

                return keySize == cipher.keySize;
            }
        });
    }

    public static MatchFunction KX(final String kx) {
        return new MatchFunction() {
            public boolean matches(Cipher cipher) {
                return kx.equals(cipher.keyExchange);
            }
        };
    }

    public static MatchFunction ENC(final String algo, final int keySize) {
        return AND(new MatchFunction() {
            public boolean matches(Cipher cipher) {
                if ( algo == null ) {
                    return cipher.encryption == null;
                }
                return algo.equals( cipher.encryption );
            }
        }, new MatchFunction() {
            public boolean matches(Cipher cipher) {
                if (keySize < 0) {
                    return true;
                }

                return cipher.keySize == keySize;
            }
        });
    }

    public static MatchFunction MAC(final String algo) {
        return new MatchFunction() {
            public boolean matches(Cipher cipher) {
                if ( algo == null ) {
                    return cipher.mac == null;
                }
                return algo.equals( cipher.mac );
            }
        };
    }

    public static MatchFunction AUTH(final String algo) {
        return new MatchFunction() {
            public boolean matches(Cipher cipher) {
                if (algo == null) {
                    return cipher.auth == null;
                }
                return algo.equals( cipher.auth );
            }
        };
    }

    public static MatchFunction PROTOCOL(final String name, final String version) {
        return new MatchFunction() {
            public boolean matches(Cipher cipher) {
                return cipher.protocol.equals( Protocol.valueOf( name ) ) && cipher.version.equals( version );
            }
        };
    }

    public static MatchFunction DEFAULT = match("ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-DSS-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA256:DHE-RSA-AES256-SHA:DHE-DSS-AES256-SHA:DHE-RSA-CAMELLIA256-SHA:DHE-DSS-CAMELLIA256-SHA:ECDH-RSA-AES256-GCM-SHA384:ECDH-ECDSA-AES256-GCM-SHA384:ECDH-RSA-AES256-SHA384:ECDH-ECDSA-AES256-SHA384:ECDH-RSA-AES256-SHA:ECDH-ECDSA-AES256-SHA:AES256-GCM-SHA384:AES256-SHA256:AES256-SHA:CAMELLIA256-SHA:PSK-AES256-CBC-SHA:ECDHE-RSA-DES-CBC3-SHA:ECDHE-ECDSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:EDH-DSS-DES-CBC3-SHA:ECDH-RSA-DES-CBC3-SHA:ECDH-ECDSA-DES-CBC3-SHA:DES-CBC3-SHA:PSK-3DES-EDE-CBC-SHA:KRB5-DES-CBC3-SHA:KRB5-DES-CBC3-MD5:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:DHE-DSS-AES128-GCM-SHA256:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES128-SHA256:DHE-DSS-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA:DHE-RSA-SEED-SHA:DHE-DSS-SEED-SHA:DHE-RSA-CAMELLIA128-SHA:DHE-DSS-CAMELLIA128-SHA:ECDH-RSA-AES128-GCM-SHA256:ECDH-ECDSA-AES128-GCM-SHA256:ECDH-RSA-AES128-SHA256:ECDH-ECDSA-AES128-SHA256:ECDH-RSA-AES128-SHA:ECDH-ECDSA-AES128-SHA:AES128-GCM-SHA256:AES128-SHA256:AES128-SHA:SEED-SHA:CAMELLIA128-SHA:IDEA-CBC-SHA:PSK-AES128-CBC-SHA:KRB5-IDEA-CBC-SHA:KRB5-IDEA-CBC-MD5:ECDHE-RSA-RC4-SHA:ECDHE-ECDSA-RC4-SHA:ECDH-RSA-RC4-SHA:ECDH-ECDSA-RC4-SHA:RC4-SHA:RC4-MD5:PSK-RC4-SHA:KRB5-RC4-SHA:KRB5-RC4-MD5:EDH-RSA-DES-CBC-SHA:EDH-DSS-DES-CBC-SHA:DES-CBC-SHA:KRB5-DES-CBC-SHA:KRB5-DES-CBC-MD5:EXP-EDH-RSA-DES-CBC-SHA:EXP-EDH-DSS-DES-CBC-SHA:EXP-DES-CBC-SHA:EXP-RC2-CBC-MD5:EXP-KRB5-RC2-CBC-SHA:EXP-KRB5-DES-CBC-SHA:EXP-KRB5-RC2-CBC-MD5:EXP-KRB5-DES-CBC-MD5:EXP-RC4-MD5:EXP-KRB5-RC4-SHA:EXP-KRB5-RC4-MD5");
    public static MatchFunction COMPLEMENTOFDEFAULT = match("AECDH-AES256-SHA:ADH-AES256-GCM-SHA384:ADH-AES256-SHA256:ADH-AES256-SHA:ADH-CAMELLIA256-SHA:AECDH-DES-CBC3-SHA:ADH-DES-CBC3-SHA:AECDH-AES128-SHA:ADH-AES128-GCM-SHA256:ADH-AES128-SHA256:ADH-AES128-SHA:ADH-SEED-SHA:ADH-CAMELLIA128-SHA:AECDH-RC4-SHA:ADH-RC4-MD5:ADH-DES-CBC-SHA:EXP-ADH-DES-CBC-SHA:EXP-ADH-RC4-MD5");
    public static MatchFunction LOW = match("EDH-RSA-DES-CBC-SHA:EDH-DSS-DES-CBC-SHA:ADH-DES-CBC-SHA:DES-CBC-SHA:DES-CBC-MD5:KRB5-DES-CBC-SHA:KRB5-DES-CBC-MD5");
    public static MatchFunction MEDIUM = match("DHE-RSA-SEED-SHA:DHE-DSS-SEED-SHA:ADH-SEED-SHA:SEED-SHA:IDEA-CBC-SHA:IDEA-CBC-MD5:RC2-CBC-MD5:KRB5-IDEA-CBC-SHA:KRB5-IDEA-CBC-MD5:ECDHE-RSA-RC4-SHA:ECDHE-ECDSA-RC4-SHA:AECDH-RC4-SHA:ADH-RC4-MD5:ECDH-RSA-RC4-SHA:ECDH-ECDSA-RC4-SHA:RC4-SHA:RC4-MD5:RC4-MD5:PSK-RC4-SHA:KRB5-RC4-SHA:KRB5-RC4-MD5");
    public static MatchFunction HIGH = match("ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-DSS-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA256:DHE-RSA-AES256-SHA:DHE-DSS-AES256-SHA:DHE-RSA-CAMELLIA256-SHA:DHE-DSS-CAMELLIA256-SHA:AECDH-AES256-SHA:ADH-AES256-GCM-SHA384:ADH-AES256-SHA256:ADH-AES256-SHA:ADH-CAMELLIA256-SHA:ECDH-RSA-AES256-GCM-SHA384:ECDH-ECDSA-AES256-GCM-SHA384:ECDH-RSA-AES256-SHA384:ECDH-ECDSA-AES256-SHA384:ECDH-RSA-AES256-SHA:ECDH-ECDSA-AES256-SHA:AES256-GCM-SHA384:AES256-SHA256:AES256-SHA:CAMELLIA256-SHA:PSK-AES256-CBC-SHA:ECDHE-RSA-DES-CBC3-SHA:ECDHE-ECDSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:EDH-DSS-DES-CBC3-SHA:AECDH-DES-CBC3-SHA:ADH-DES-CBC3-SHA:ECDH-RSA-DES-CBC3-SHA:ECDH-ECDSA-DES-CBC3-SHA:DES-CBC3-SHA:DES-CBC3-MD5:PSK-3DES-EDE-CBC-SHA:KRB5-DES-CBC3-SHA:KRB5-DES-CBC3-MD5:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:DHE-DSS-AES128-GCM-SHA256:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES128-SHA256:DHE-DSS-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA:DHE-RSA-CAMELLIA128-SHA:DHE-DSS-CAMELLIA128-SHA:AECDH-AES128-SHA:ADH-AES128-GCM-SHA256:ADH-AES128-SHA256:ADH-AES128-SHA:ADH-CAMELLIA128-SHA:ECDH-RSA-AES128-GCM-SHA256:ECDH-ECDSA-AES128-GCM-SHA256:ECDH-RSA-AES128-SHA256:ECDH-ECDSA-AES128-SHA256:ECDH-RSA-AES128-SHA:ECDH-ECDSA-AES128-SHA:AES128-GCM-SHA256:AES128-SHA256:AES128-SHA:CAMELLIA128-SHA:PSK-AES128-CBC-SHA");

    public static MatchFunction kEDH = match("DHE-DSS-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA256:DHE-RSA-AES256-SHA:DHE-DSS-AES256-SHA:DHE-RSA-CAMELLIA256-SHA:DHE-DSS-CAMELLIA256-SHA:ADH-AES256-GCM-SHA384:ADH-AES256-SHA256:ADH-AES256-SHA:ADH-CAMELLIA256-SHA:EDH-RSA-DES-CBC3-SHA:EDH-DSS-DES-CBC3-SHA:ADH-DES-CBC3-SHA:DHE-DSS-AES128-GCM-SHA256:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES128-SHA256:DHE-DSS-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA:DHE-RSA-SEED-SHA:DHE-DSS-SEED-SHA:DHE-RSA-CAMELLIA128-SHA:DHE-DSS-CAMELLIA128-SHA:ADH-AES128-GCM-SHA256:ADH-AES128-SHA256:ADH-AES128-SHA:ADH-SEED-SHA:ADH-CAMELLIA128-SHA:ADH-RC4-MD5:EDH-RSA-DES-CBC-SHA:EDH-DSS-DES-CBC-SHA:ADH-DES-CBC-SHA:EXP-EDH-RSA-DES-CBC-SHA:EXP-EDH-DSS-DES-CBC-SHA:EXP-ADH-DES-CBC-SHA:EXP-ADH-RC4-MD5");
    public static MatchFunction EDH = match("DHE-DSS-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA256:DHE-RSA-AES256-SHA:DHE-DSS-AES256-SHA:DHE-RSA-CAMELLIA256-SHA:DHE-DSS-CAMELLIA256-SHA:EDH-RSA-DES-CBC3-SHA:EDH-DSS-DES-CBC3-SHA:DHE-DSS-AES128-GCM-SHA256:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES128-SHA256:DHE-DSS-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA:DHE-RSA-SEED-SHA:DHE-DSS-SEED-SHA:DHE-RSA-CAMELLIA128-SHA:DHE-DSS-CAMELLIA128-SHA:EDH-RSA-DES-CBC-SHA:EDH-DSS-DES-CBC-SHA:EXP-EDH-RSA-DES-CBC-SHA:EXP-EDH-DSS-DES-CBC-SHA");
    public static MatchFunction ADH = match("ADH-AES256-GCM-SHA384:ADH-AES256-SHA256:ADH-AES256-SHA:ADH-CAMELLIA256-SHA:ADH-DES-CBC3-SHA:ADH-AES128-GCM-SHA256:ADH-AES128-SHA256:ADH-AES128-SHA:ADH-SEED-SHA:ADH-CAMELLIA128-SHA:ADH-RC4-MD5:ADH-DES-CBC-SHA:EXP-ADH-DES-CBC-SHA:EXP-ADH-RC4-MD5");

    public static MatchFunction DH = match("DHE-DSS-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA256:DHE-RSA-AES256-SHA:DHE-DSS-AES256-SHA:DHE-RSA-CAMELLIA256-SHA:DHE-DSS-CAMELLIA256-SHA:ADH-AES256-GCM-SHA384:ADH-AES256-SHA256:ADH-AES256-SHA:ADH-CAMELLIA256-SHA:EDH-RSA-DES-CBC3-SHA:EDH-DSS-DES-CBC3-SHA:ADH-DES-CBC3-SHA:DHE-DSS-AES128-GCM-SHA256:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES128-SHA256:DHE-DSS-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA:DHE-RSA-SEED-SHA:DHE-DSS-SEED-SHA:DHE-RSA-CAMELLIA128-SHA:DHE-DSS-CAMELLIA128-SHA:ADH-AES128-GCM-SHA256:ADH-AES128-SHA256:ADH-AES128-SHA:ADH-SEED-SHA:ADH-CAMELLIA128-SHA:ADH-RC4-MD5:EDH-RSA-DES-CBC-SHA:EDH-DSS-DES-CBC-SHA:ADH-DES-CBC-SHA:EXP-EDH-RSA-DES-CBC-SHA:EXP-EDH-DSS-DES-CBC-SHA:EXP-ADH-DES-CBC-SHA:EXP-ADH-RC4-MD5");

    public static MatchFunction kEECDH = match("ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:AECDH-AES256-SHA:ECDHE-RSA-DES-CBC3-SHA:ECDHE-ECDSA-DES-CBC3-SHA:AECDH-DES-CBC3-SHA:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:AECDH-AES128-SHA:ECDHE-RSA-RC4-SHA:ECDHE-ECDSA-RC4-SHA:AECDH-RC4-SHA:ECDHE-RSA-NULL-SHA:ECDHE-ECDSA-NULL-SHA:AECDH-NULL-SHA");

    public static MatchFunction ALL = new MatchFunction() {
        public boolean matches(Cipher cipher) {
            return cipher.encryption != null;
        }
    };

    public static MatchFunction COMPLEMENTOFALL = new MatchFunction() {
        public boolean matches(Cipher cipher) {
            return cipher.encryption == null;
        }
    };


    private static MatchFunction match(String spec) {
        StringTokenizer tokens = new StringTokenizer(spec, ":");

        final Set<String> names = new HashSet<>();

        while (tokens.hasMoreTokens()) {
            names.add(tokens.nextToken());
        }

        return new MatchFunction() {
            public boolean matches(Cipher cipher) {
                return names.contains(cipher.opensslName);
            }
        };
    }

    private static MatchFunction matchName(final String name) {
        return new MatchFunction() {
            public boolean matches(Cipher cipher) {
                return cipher.opensslName.equals( name );
            }
        };
    }


    public static List<Cipher> get(String str) {

        MatchFunction fn = null;

        switch (str) {
            case "DEFAULT":
                fn = DEFAULT;
                break;
            case "COMPLETEMENTOFDEFAULT":
                fn = COMPLEMENTOFDEFAULT;
                break;
            case "ALL":
                fn = ALL;
                break;
            case "COMPLETEMENTOFALL":
                fn = COMPLEMENTOFALL;
                break;
            case "HIGH":
                fn = HIGH;
                break;
            case "MEDIUM":
                fn = MEDIUM;
                break;
            case "LOW":
                fn = LOW;
                break;
            case "EXP":
            case "EXPORT":
                fn = EXPORT(-1);
                break;
            case "EXPORT40":
                fn = EXPORT(40);
                break;
            case "EXPORT56":
                fn = EXPORT(56);
                break;
            case "eNULL":
            case "NULL":
                fn = new MatchFunction() {
                    public boolean matches(Cipher cipher) {
                        return cipher.encryption == null;
                    }
                };
                break;
            case "aNULL":
                fn = new MatchFunction() {
                    public boolean matches(Cipher cipher) {
                        return cipher.auth == null;
                    }
                };
                break;
            case "kRSA":
                fn = KX("RSA");
                break;
            case "aRSA":
                fn = AUTH("RSA");
                break;
            case "RSA":
                fn = OR(KX("RSA"), AUTH("RSA"));
                break;
            case "kDHr":
                fn = FALSE;
                break;
            case "kDHd":
                fn = FALSE;
                break;
            case "kDH":
                fn = FALSE;
                break;
            case "kDHE":
            case "kEDH":
                fn = kEDH;
                break;
            case "DHE":
            case "EDH":
                fn = EDH;
                break;
            case "ADH":
                fn = ADH;
                break;
            case "DH":
                fn = DH;
                break;
            case "kECDHr":
                fn = KX("ECDH/RSA");
                break;
            case "kECDHe":
                fn = KX("ECDH/ECDSA");
                break;
            case "kECDH":
                fn = OR(KX("ECDH/RSA"), KX("ECDH/ECDS"));
                break;
            case "kEECDH":
            case "kECDHE":
                fn = kEECDH;
                break;
            case "ECDHE":
            case "EECDHE":
                fn = FALSE;
                break;
            case "AECDH":
                fn = AND(KX("ECDH"), AUTH(null));
                break;
            case "ECDH":
                fn = OR(KX("ECDH"), OR(KX("ECDH/ECDSA"), KX("ECDH/RSA")));
                break;
            case "aDSS":
            case "DSS":
                fn = AUTH("DSS" );
                break;
            case "aDH":
                fn = FALSE;
                break;
            case "aECDH":
                fn = AUTH("ECDH" );
                break;
            case "aECDSA":
            case "ECDSA":
                fn = AUTH("ECDSA" );
                break;
            case "kFZA":
            case "aFZA":
            case "eFZA":
            case "FZA":
                fn = FALSE;
                break;
            case "TLSv1.2":
                fn = PROTOCOL( "TLS", "1.2" );
                break;
            case "TLSv1":
                fn = PROTOCOL( "TLS", "1" );
                break;
            case "SSLv3":
                fn = PROTOCOL( "SSL", "3" );
                break;
            case "SSLv2":
                fn = PROTOCOL( "SSL", "2" );
                break;
            case "AES128":
                fn = ENC("AES", 128);
                break;
            case "AES256":
                fn = ENC("AES", 256);
                break;
            case "AES":
                fn = ENC("AES", -1);
                break;
            case "AESGCM":
                break;
            case "CAMELLIA128":
                fn = ENC("CAMELLIA", 128);
                break;
            case "CAMELLIA256":
                fn = ENC("CAMELLIA", 256);
                break;
            case "CAMELLIA":
                fn = ENC("CAMELLIA", -1);
                break;
            case "3DES":
                fn = ENC("3DES", -1);
                break;
            case "DES":
                fn = ENC("DES", -1);
                break;
            case "RC4":
                fn = ENC("RC4", -1);
                break;
            case "RC2":
                fn = ENC("RC2", -1);
                break;
            case "IDEA":
                fn = ENC("IDEA", -1);
                break;
            case "SEED":
                fn = ENC("SEED", -1);
                break;
            case "MD5":
                fn = MAC("MD5");
                break;
            case "SHA1":
            case "SHA":
                fn = MAC("SHA1");
                break;
            case "SHA256":
                fn = MAC("SHA256");
                break;
            case "SHA384":
                fn = MAC("SHA384");
                break;
            case "aGOST":
                fn = FALSE;
                break;
            case "aGOST01":
                fn = FALSE;
                break;
            case "aGOST94":
                fn = FALSE;
                break;
            case "kGOST":
                fn = FALSE;
                break;
            case "GOST94":
                fn = FALSE;
                break;
            case "GOST89MAC":
                fn = FALSE;
                break;
            case "PSK":
                fn = KX("PSK");
                break;
            // UNDOCUMENTED
            case "aKRB5":
                fn = AUTH("KRB5" );
                break;
            case "kKRB5":
                fn = KX("KRB5" );
                break;
            case "KRB5":
                fn = OR( KX("KRB5"), AUTH("KRB5" ) );
                break;
            default:
                fn = matchName( str );
                break;
        }

        if ( fn == null ) {
            return Collections.emptyList();
        }

        List<Cipher> matched = get(fn);
        return matched;
    }


}
