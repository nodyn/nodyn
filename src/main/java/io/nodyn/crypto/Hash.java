package io.nodyn.crypto;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.nodyn.crypto.encoders.Encoder;

import java.nio.charset.Charset;
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
