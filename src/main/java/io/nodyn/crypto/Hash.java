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

import io.nodyn.buffer.Buffer;
import java.nio.ByteBuffer;
import org.bouncycastle.crypto.Digest;

import java.security.NoSuchAlgorithmException;

public class Hash {

    private final Digest digest;

    public Hash(Digest digest) {
        this.digest = digest;
    }

    public void update(ByteBuffer buf) {
        byte[] bytes = Buffer.extractByteArray(buf);
        this.digest.update( bytes, 0, bytes.length );
    }

    public ByteBuffer digest() throws NoSuchAlgorithmException {
        byte[] digestBytes = new byte[ this.digest.getDigestSize() ];
        this.digest.doFinal( digestBytes, 0 );
        ByteBuffer out = ByteBuffer.allocate( digestBytes.length );
        out.put(digestBytes);
        return out;
    }
}
