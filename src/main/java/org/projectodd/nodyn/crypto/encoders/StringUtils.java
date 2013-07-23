/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.projectodd.nodyn.crypto.encoders;

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;

/**
 * Converts String to and from bytes using the encodings required by the Java specification. These encodings are
 * specified in <a href="http://download.oracle.com/javase/6/docs/api/java/nio/charset/Charset.html">
 * Standard charsets</a>.
 * <p/>
 * <p>This class is immutable and thread-safe.</p>
 *
 * @version $Id$
 * @see <a href="http://commons.apache.org/proper/commons-codec/apidocs/org/apache/commons/codec/CharEncoding.html">CharEncoding</a>
 * @see <a href="http://download.oracle.com/javase/6/docs/api/java/nio/charset/Charset.html">Standard charsets</a>
 * @since 1.4
 */
public class StringUtils {

    public static final Charset US_ASCII = Charset.forName("US-ASCII");

    /**
     * Encodes the given string into a sequence of bytes using the US-ASCII charset, storing the result into a new byte
     * array.
     *
     * @param string the String to encode, may be {@code null}
     * @return encoded bytes, or {@code null} if the input string was {@code null}
     * @throws NullPointerException Thrown if {@link #US_ASCII} is not initialized, which should never happen since it is
     *                              required by the Java platform specification.
     * @see <a href="http://download.oracle.com/javase/6/docs/api/java/nio/charset/Charset.html">Standard charsets</a>
     * @since As of 1.7, throws {@link NullPointerException} instead of UnsupportedEncodingException
     */
    public static byte[] getBytesUsAscii(final String string) {
        return string == null ? null : string.getBytes(US_ASCII);
    }

    /**
     * Constructs a new <code>String</code> by decoding the specified array of bytes using the US-ASCII charset.
     *
     * @param bytes The bytes to be decoded into characters
     * @return A new <code>String</code> decoded from the specified array of bytes using the US-ASCII charset,
     *         or {@code null} if the input byte array was {@code null}.
     * @throws NullPointerException Thrown if {@link #US_ASCII} is not initialized, which should never happen since it is
     *                              required by the Java platform specification.
     * @since As of 1.7, throws {@link NullPointerException} instead of UnsupportedEncodingException
     */
    public static String newStringUsAscii(final byte[] bytes) {
        return new String(bytes, US_ASCII);
    }

}
