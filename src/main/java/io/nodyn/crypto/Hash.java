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

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Hash {

    private MessageDigest digest;

    public Hash(String algorithm) {
        try {
            this.digest = MessageDigest.getInstance(algorithm);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hash algorithm not found: " + algorithm);
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
