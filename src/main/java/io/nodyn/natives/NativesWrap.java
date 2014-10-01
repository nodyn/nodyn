/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.nodyn.natives;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * @author Bob McWhirter
 */
public class NativesWrap {

    public static String getSource(String name) throws IOException {
        try {
            InputStream in = NativesWrap.class.getClassLoader().getResourceAsStream(name + ".js");
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
        } catch (Throwable t) {
            System.err.println( "error loading: " + name );
            throw t;
        }
    }
}
