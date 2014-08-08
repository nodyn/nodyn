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

package io.nodyn.crypto;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.Charset;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

public class Hmac {

    private final Mac hmac;

    public Hmac(String algorithm, String key) {
        try {
            this.hmac = Mac.getInstance(algorithm);
            computeKey(algorithm, key);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hmac algorithm not found: " + algorithm);
        } catch (InvalidKeyException e) {
            throw new RuntimeException("Invalid key: " + algorithm);
        }
    }

    private void computeKey(String algorithm, String key) throws InvalidKeyException {
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), algorithm);
        this.hmac.init(secretKey);
    }

    public void update(String message, String encoding) {
        this.hmac.update(message.getBytes(Charset.forName(encoding)));
    }

    public void update(String message) {
        // TODO: The default in node.js, when an encoding is not specified
        // is to assume a Buffer. For now, we'll just default to UTF-8 and
        // see how far that gets us. Soon, I'm sure, we'll need to rip out
        // the Buffer classes from this project and move entirely to using
        // vert.x Buffers.  It is truly amazing that all six lines of this
        // comment have the same number of characters, isn't it?  Amazing!
        this.update(message, "UTF-8");
    }


}
