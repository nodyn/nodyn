package io.nodyn.buffer;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;

/**
 * @author Bob McWhirter
 */
public class BufferWrap {

    public static int byteLength(String str, String enc) throws UnsupportedEncodingException {
        return str.getBytes(enc).length;
    }

    public static int _charsWritten = 0;

    private final ByteBuf buffer;
    private final int length;

    public BufferWrap(int length) {
        this.buffer = Unpooled.buffer(length);
        this.length = length;
    }

    public BufferWrap(byte[] bytes) {
        this.buffer = Unpooled.copiedBuffer(bytes);
        this.length = bytes.length;
    }

    public BufferWrap(String contents, String encoding) {
        this.buffer = Unpooled.copiedBuffer(contents, Charset.forName(encoding));
        this.length = this.buffer.readableBytes();
    }

    public BufferWrap(ByteBuf buffer) {
        this.buffer = buffer;
        this.length = buffer.readableBytes();
    }

    public int getByte(int offset) {
        return this.buffer.getByte(offset) & 0xFF;
    }

    public void putByte(int offset, int value) {
        this.buffer.setByte(offset, value & 0xFF);
        this.buffer.writerIndex( Math.max( this.buffer.writerIndex(), offset + 1 ) );
    }

    public int getLength() {
        return this.length;
    }

    public byte[] byteArray() {
        byte[] bytes = new byte[ this.buffer.readableBytes() ];
        this.buffer.getBytes(0, bytes );
        return bytes;
        //return this.buffer.array();
    }

    public ByteBuf getByteBuf() {
        return this.buffer;
    }

    public int write(String str, int offset, int length, String encoding) {
        int maxBytes = Math.min(this.length - offset, length);

        int seenChars = 0;
        int seenBytes = 0;

        Charset charset = Charset.forName(encoding);

        int strLen = str.length();

        for (int i = 0; i < strLen; ++i) {
            byte[] charBytes = str.substring(i, i + 1).getBytes(charset);
            if (seenBytes + charBytes.length > maxBytes) {
                break;
            }
            seenBytes += charBytes.length;
            ++seenChars;
        }


        this.buffer.setBytes(offset, str.getBytes(charset), 0, seenBytes);
        this.buffer.writerIndex(offset + seenBytes);

        _charsWritten = seenChars;

        return seenBytes;
    }

    public int copy(BufferWrap target, int targetStart, int sourceStart, int sourceEnd) {
        if (sourceEnd == -1) {
            sourceEnd = this.length;
        }

        int length = sourceEnd - sourceStart;

        int copyLen = Math.min(target.length - targetStart, length);

        target.buffer.setBytes(targetStart, this.buffer, sourceStart, copyLen);

        target.buffer.writerIndex(targetStart + copyLen);

        return copyLen;
    }

    public BufferWrap slice(int start, int end) {
        if (end == -1) {
            end = this.length;
        }

        int length = end - start;

        return new BufferWrap(this.buffer.slice(start, length));
    }

    public void fill(int value, int offset, int end) {
        if (end == -1) {
            end = this.length;
        }

        for (int i = offset; i < end; ++i) {
            this.buffer.writerIndex(i);
            this.buffer.writeByte(value);
        }
    }

    public void fill(String value, int offset, int end) {
        if (value.isEmpty()) {
            return;
        }

        fill(value.getBytes()[0], offset, end);
    }

    public long readUInt8(int offset) {
        return this.buffer.getUnsignedByte(offset);
    }

    public void writeUInt8(long val, int offset) {
        this.buffer.setInt(offset, (int) val);
    }

    public long readInt8(int offset) {
        return this.buffer.getByte(offset);
    }

    public void writeInt8(long val, int offset) {
        this.buffer.setByte(offset, (int) (val & 0xFF));
    }

    // 16-bit unsigned

    public long readUInt16BE(int offset) {
        return this.buffer.getUnsignedShort(offset);
    }

    public void writeUInt16BE(long val, int offset) {
        this.buffer.setShort(offset, (int) (val & 0xFFFF));
    }

    public long readUInt16LE(int offset) {
        int val = this.buffer.getUnsignedShort(offset);
        return Integer.reverseBytes(val) >>> 16 & 0xFFFF;
    }

    public void writeUInt16LE(long val, int offset) {
        this.buffer.setShort(offset, Integer.reverseBytes((int) val) >>> 16);
    }


    // 16-bit signed

    public long readInt16BE(int offset) {
        return this.buffer.getShort(offset);
    }

    public void writeInt16BE(long val, int offset) {
        this.buffer.setShort(offset, (int) val);

    }

    public long readInt16LE(int offset) {
        long val = this.buffer.getShort(offset);
        return Integer.reverseBytes((int) val) >> 16;
    }

    public void writeInt16LE(long val, int offset) {
        this.buffer.setShort(offset, Integer.reverseBytes((int) val) >> 16);
    }

    // 32-bit unsigned

    public long readUInt32BE(int offset) {
        return this.buffer.getUnsignedInt(offset);
    }

    public void writeUInt32BE(long value, int offset) {
        this.buffer.setInt(offset, (int) (value & 0xFFFFFFFF));
    }

    public long readUInt32LE(int offset) {
        long val = this.buffer.getUnsignedInt(offset);
        return Long.reverseBytes(val) >>> 32;
    }

    public void writeUInt32LE(long value, int offset) {
        this.buffer.setInt(offset, (int) (Long.reverseBytes(value) >>> 32));
    }

    // 32-bit signed

    public long readInt32BE(int offset) {
        return this.buffer.getInt(offset);
    }

    public void writeInt32BE(long value, int offset) {
        this.buffer.setInt(offset, (int) value);
    }

    public long readInt32LE(int offset) {
        long val = this.buffer.getInt(offset);
        return Long.reverseBytes(val) >> 32;
    }

    public void writeInt32LE(long value, int offset) {
        this.buffer.setInt(offset, (int) (Long.reverseBytes(value) >> 32));

    }

    // float

    public double readFloatBE(int offset) {
        return this.buffer.getFloat(offset);
    }

    public void writeFloatBE(double value, int offset) {
        this.buffer.setFloat(offset, (float) value);
    }

    public double readFloatLE(int offset) {
        int bits = this.buffer.getInt(offset);
        return Float.intBitsToFloat(Integer.reverseBytes(bits));
    }

    public void writeFloatLE(double value, int offset) {
        int bits = Float.floatToIntBits((float) value);
        this.buffer.setInt(offset, Integer.reverseBytes(bits));
    }

    // double

    public double readDoubleBE(int offset) {
        return this.buffer.getDouble(offset);
    }

    public void writeDoubleBE(double value, int offset) {
        this.buffer.setDouble(offset,value);
    }

    public double readDoubleLE(int offset) {
        long bits = this.buffer.getLong(offset);
        return Double.longBitsToDouble( Long.reverseBytes( bits ) );
    }

    public void writeDoubleLE(double value, int offset) {
        long bits = Double.doubleToLongBits( value );
        this.buffer.setLong( offset, Long.reverse( bits ) );
    }

    //

    public String toString() {
        return this.buffer.toString();
    }

    public String toString(String encoding) {
        return this.buffer.toString(Charset.forName(encoding));
    }


}
