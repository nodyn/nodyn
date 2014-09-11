package io.nodyn.tls;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Bob McWhirter
 */
public class TLSNames {

    private static Map<String, String> names = new HashMap<>();

    static {
        try {
            loadTlsNames();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void loadTlsNames() throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(io.nodyn.tls.Cipher.class.getClassLoader().getResourceAsStream("tls-names.txt")));
        String line = null;
        while ((line = in.readLine()) != null) {
            processLine(line);
        }
    }

    private static void processLine(String line) {
        int equalLoc = line.indexOf('=');

        if (equalLoc > 0) {
            String code = line.substring(0, equalLoc);
            String name = line.substring(equalLoc + 1);
            names.put( code, name );
        }
    }

    public static String lookup(String code) {
        return names.get( code );
    }
}
