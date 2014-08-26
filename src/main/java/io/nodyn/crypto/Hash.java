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

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import org.bouncycastle.jcajce.provider.digest.MD5;
import org.bouncycastle.jcajce.provider.digest.SHA1;
import org.bouncycastle.jcajce.provider.digest.SHA256;
import org.bouncycastle.jcajce.provider.digest.SHA512;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Hash {

    private final MessageDigest digest;

    public Hash(String algorithm) {
        switch (algorithm) {
            case "sha1":
                this.digest = new SHA1.Digest();
                break;
            case "md5":
                this.digest = new MD5.Digest();
                break;
            case "sha256":
                this.digest = new SHA256.Digest();
                break;
            case "sha512":
                this.digest = new SHA512.Digest();
                break;
            default: {
                throw new IllegalArgumentException( "Invalid hash algorithm: " + algorithm );
            }
        }
    }

    public void update(ByteBuf buf) {
        byte[] bytes = new byte[ buf.readableBytes() ];
        buf.getBytes( buf.readerIndex(), bytes );
        this.digest.update( bytes );
    }

    public ByteBuf digest() throws NoSuchAlgorithmException {
        byte[] digestBytes = this.digest.digest();
        return Unpooled.wrappedBuffer( digestBytes );
    }
}
