package io.nodyn.natives;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Bob McWhirter
 */
public class NativesWrap {

    public static String getSource(String name) throws IOException {
        InputStream in = NativesWrap.class.getClassLoader().getResourceAsStream(name + ".js" );
        InputStreamReader reader = new InputStreamReader(in);

        StringBuilder source = new StringBuilder();
        try {

            char[] buf = new char[4096];
            int numRead = 0;

            while ((numRead = reader.read(buf)) >= 0) {
                source.append(buf, 0, numRead);
            }
        } finally {
            try {
                reader.close();
            } catch (IOException e) {
            }
        }

        return source.toString();
    }
}
