package org.projectodd.nodej.bindings.buffer;

import java.io.UnsupportedEncodingException;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.Types;
import org.projectodd.nodej.bindings.buffer.prototype.Copy;
import org.projectodd.nodej.bindings.buffer.prototype.Fill;
import org.projectodd.nodej.bindings.buffer.prototype.ToString;
import org.projectodd.nodej.bindings.buffer.prototype.Write;

public class Buffer extends DynObject {
    public enum Encoding {
        UTF8, UCS2, ASCII, BASE64, BINARY
    }
    
    public Buffer(final GlobalObject globalObject, long length) {
        super(globalObject);
        setBackingArray(new Object[(int) length]);
        setClassName("SlowBuffer");
        put(null, "length", length, false);
        defineReadOnlyProperty(globalObject, "copy", new Copy(globalObject));
        defineReadOnlyProperty(globalObject, "fill", new Fill(globalObject));
        defineReadOnlyProperty(globalObject, "utf8Write", new Write(globalObject, Buffer.Encoding.UTF8));
        defineReadOnlyProperty(globalObject, "asciiWrite", new Write(globalObject, Buffer.Encoding.ASCII));
        defineReadOnlyProperty(globalObject, "toString", new ToString(globalObject));
    }
    
    public void fill(byte b, int offset, int end) {
        if (offset >= getBuffer().length ) {
            return;
        }
        if (end > getBuffer().length) {
            throw new ThrowException(null, "end cannot be longer than length");
        }
        for (int i=offset; i < end; i++) {
            putValueAtIndex(null, b, i);
        }
    }
    
    public long copy(Object[] objects, int targetStart, int sourceStart, int sourceEnd) {
        if (sourceEnd == sourceStart) {
            return 0L;
        }
        if (sourceStart > sourceEnd) {
            throw new ThrowException(null, "sourceEnd < sourceStart");
        }
        if (targetStart >= getBuffer().length) {
            throw new ThrowException(null, "targetStart out of bounds");
        }
        if (sourceStart >= objects.length) {
            throw new ThrowException(null, "sourceStart out of bounds");
        }
        if (sourceEnd > objects.length) {
            throw new ThrowException(null, "sourceEnd out of bounds");
        }
        int counter = 0;
        for (int i = sourceStart; i < sourceEnd; i++) {
            putValueAtIndex(null, objects[i], targetStart+counter);
            counter++;
        }
        return counter;
    }
    
    @Override
    protected void putValueAtIndex(ExecutionContext context, Object value, int index) {
        Long numberValue = Types.toUint32(context, value);
        this.getBackingArray()[index] = numberValue.byteValue() & 0xff;
    }
    
    @Override
    public String toString() {
        // There has to be a better way
        Object[] objects = getBackingArray();
        byte[] bytes = new byte[objects.length];
        int i = 0;
        for(Object b: objects) {
            if (b != null) {
                bytes[i++] = ((Integer)b).byteValue();
            }
        }
        try {
            return new String(bytes, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return super.toString();
    }
    
    public Object[] getBuffer() {
        return super.getBackingArray();
    }

    public long write(String string, Encoding encoding, int offset, int maxLength) {
        int length = string.length();
        if (length == 0) { return 0; }
        if (length > 0 && offset > getBuffer().length) {
            throw new ThrowException(null, "Offset is out of bounds");
        }
        String charset = "UTF-8";
        switch(encoding) {
        case UTF8: 
            break;
        case ASCII:
            charset = "US-ASCII";
            break;
        }
        try {
            return this.copy(getByteObjectArray(string, charset), offset, 0, maxLength); 
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return 0;
    }


    public static Byte[] getByteObjectArray(String string, String charset) throws UnsupportedEncodingException {
        byte[] stringBytes = string.getBytes(charset);
        Byte[] fancyBytes = new Byte[stringBytes.length];
        int i = 0;
        for(byte b: stringBytes) {
            fancyBytes[i++] = new Byte(b);
        }
        return fancyBytes;
    }
}