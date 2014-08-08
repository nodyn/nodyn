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

package io.nodyn.buffer;

import io.netty.buffer.ByteBuf;
import org.bouncycastle.util.encoders.Base64;
import org.bouncycastle.util.encoders.Hex;
import org.dynjs.runtime.JSObject;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

/**
 * @author Bob McWhirter
 */
public class Buffer {

    private static final Charset UTF8 = StandardCharsets.UTF_8;
    private static final Charset ASCII = StandardCharsets.US_ASCII;
    private static final Charset UCS2 = StandardCharsets.UTF_16LE;
    private static final Charset BINARY = StandardCharsets.ISO_8859_1;

    public static void inject(JSObject object, ByteBuf buf) {
        object.setExternalIndexedData( new NettyExternalIndexedData( buf ) );
    }

    public static ByteBuf extract(JSObject object) {
        return ((NettyExternalIndexedData)object.getExternalIndexedData()).buffer();
    }

    public static byte[] extractByteArray(JSObject object) {
        ByteBuf buf = extract( object );
        byte[] bytes = new byte[ bufLen( object ) ];
        buf.getBytes( buf.readerIndex(), bytes );
        return bytes;
    }

    public static int bufLen(JSObject obj) {
        return ((Number) obj.get( null, "length" )).intValue();
    }

    // ----------------------------------------
    // ----------------------------------------

    public static Object fill(JSObject obj, Object val, int offset, int end) {
        int byteVal = 0;
        if ( val instanceof Number ) {
            byteVal = ((Number) val).intValue() & 0xFF;
        } else if ( val instanceof String && ! ((String) val).isEmpty() ) {
            byteVal = ((String) val).charAt(0);
        }
        ByteBuf b = extract(obj);
        for ( int i = offset; i < end; ++i ) {
            b.setByte( i, byteVal );
        }
        b.writerIndex( Math.max( b.writerIndex(), offset + end ) );
        return obj;
    }

    public static long copy(JSObject src, JSObject target, int targetStart, int sourceStart, int sourceEnd) {

        ByteBuf srcBuf = extract(src);
        ByteBuf targetBuf = extract(target);

        int origWriter = targetBuf.writerIndex();

        targetBuf.writerIndex( targetStart );

        int len = sourceEnd - sourceStart;

        len = Math.min( len, bufLen( target ) - targetStart );

        targetBuf.writeBytes(srcBuf, sourceStart, len);
        targetBuf.writerIndex(Math.max(targetBuf.writerIndex(), origWriter));

        return len;
    }


    // ----------------------------------------
    // utf8
    // ----------------------------------------

    public static long[] utf8Write(JSObject object, String str, int offset, int len) {
        ByteBuf b = extract( object );
        int origWriter = b.writerIndex();
        byte[] bytes = str.getBytes( UTF8 );
        b.writerIndex( offset );
        len = Math.min( bytes.length, Math.min( len, bufLen(object) - offset  ) );
        b.writeBytes( bytes, 0, len );
        b.writerIndex( Math.max( b.writerIndex(), origWriter ) );
        return new long[] { str.length(), len };
    }

    public static String utf8Slice(JSObject object, int start, int end) {
        ByteBuf b = extract( object );
        return b.toString( start, (end-start), UTF8 );
    }

    // ----------------------------------------
    // ascii
    // ----------------------------------------

    public static long asciiWrite(JSObject object, String str, int offset, int len) {
        ByteBuf b = extract( object );
        int origWriter = b.writerIndex();
        byte[] bytes = str.getBytes( ASCII );
        len = Math.min( bytes.length, Math.min( len, b.writableBytes() ) );
        b.writeBytes( bytes, 0, len );
        b.writerIndex( Math.max( b.writerIndex(), origWriter ) );
        return len;
    }

    public static String asciiSlice(JSObject object, int start, int end) {
        ByteBuf b = extract( object );
        return b.toString( start, (end-start), ASCII );
    }

    // ----------------------------------------
    // ucs2
    // ----------------------------------------

    public static long ucs2Write(JSObject object, String str, int offset, int len) {
        ByteBuf b = extract( object );
        int origWriter = b.writerIndex();
        byte[] bytes = str.getBytes( UCS2 );
        len = Math.min( bytes.length, Math.min( len, b.writableBytes() ) );
        b.writeBytes( bytes, 0, len );
        b.writerIndex( Math.max( b.writerIndex(), origWriter ) );
        return len;
    }

    public static String ucs2Slice(JSObject object, int start, int end) {
        ByteBuf b = extract( object );
        return b.toString( start, (end-start), UCS2 );
    }

    // ----------------------------------------
    // hex
    // ----------------------------------------

    public static long hexWrite(JSObject object, String str, int offset, int len) {
        ByteBuf b = extract( object );
        int origWriter = b.writerIndex();
        byte[] bytes = Hex.decode(str);
        b.writerIndex( offset );
        len = Math.min( bytes.length, Math.min( len, b.writableBytes() ) );
        b.writeBytes( bytes, 0, len );
        b.writerIndex( Math.max( b.writerIndex(), origWriter ) );
        return len;
    }

    public static String hexSlice(JSObject object, int start, int end) {
        ByteBuf b = extract( object );
        byte[] bytes = new byte[ end-start ];
        b.getBytes( start, bytes );
        return Hex.toHexString( bytes );
    }

    // ----------------------------------------
    // base64
    // ----------------------------------------

    public static long base64Write(JSObject object, String str, int offset, int len) {
        ByteBuf b = extract( object );
        int origWriter = b.writerIndex();
        byte[] bytes = Base64.decode(str);
        b.writerIndex( offset );
        len = Math.min( bytes.length, Math.min( len, b.writableBytes() ) );
        b.writeBytes(bytes, 0, len);
        b.writerIndex(Math.max(b.writerIndex(), origWriter));
        return len;
    }

    public static String base64Slice(JSObject object, int start, int end) {
        ByteBuf b = extract( object );
        byte[] bytes = new byte[ end-start ];
        b.getBytes( start, bytes );

        return Base64.toBase64String(bytes);
    }

    // ----------------------------------------
    // binary
    // ----------------------------------------

    public static long binaryWrite(JSObject object, String str, int offset, int len) {
        ByteBuf b = extract( object );
        int origWriter = b.writerIndex();
        byte[] bytes = str.getBytes( BINARY );
        len = Math.min( bytes.length, Math.min( len, b.writableBytes() ) );
        b.writeBytes( bytes, 0, len );
        b.writerIndex( Math.max( b.writerIndex(), origWriter ) );
        return len;
    }

    public static String binarySlice(JSObject object, int start, int end) {
        ByteBuf b = extract( object );
        return b.toString( start, (end-start), BINARY );
    }

    // ----------------------------------------
    // read/write
    // ----------------------------------------

    public static void writeFloatBE(JSObject obj, float value, int offset) {
        extract( obj ).setFloat( offset, value );
    }

    public static float readFloatBE(JSObject obj, int offset) {
        return extract( obj ).getFloat( offset );
    }

    public static void writeFloatLE(JSObject obj, float value, int offset) {
        int bits = Float.floatToIntBits((float) value);
        extract(obj).setInt(offset, Integer.reverseBytes(bits));
    }

    public static float readFloatLE(JSObject obj, int offset) {
        int bits = extract(obj).getInt(offset);
        return Float.intBitsToFloat(Integer.reverseBytes(bits));
    }

    public static void writeDoubleBE(JSObject obj, double value, int offset) {
        extract( obj ).setDouble( offset, value );
    }

    public static double readDoubleBE(JSObject obj, int offset) {
        return extract(obj).getDouble( offset );
    }

    public static void writeDoubleLE(JSObject obj, double value, int offset) {
        long bits = Double.doubleToLongBits(value);
        extract(obj).setLong(offset, Long.reverse(bits));
    }

    public static double readDoubleLE(JSObject obj, int offset) {
        long bits = extract(obj).getLong(offset);
        return Double.longBitsToDouble(Long.reverseBytes(bits));
    }


}
