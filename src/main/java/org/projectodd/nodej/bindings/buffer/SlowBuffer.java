package org.projectodd.nodej.bindings.buffer;

import java.io.UnsupportedEncodingException;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.GlobalObject;
import org.projectodd.nodej.bindings.buffer.prototype.Copy;
import org.projectodd.nodej.bindings.buffer.prototype.Fill;
import org.projectodd.nodej.bindings.buffer.prototype.ToString;

public class SlowBuffer extends DynObject {
    private byte[] buffer;
    
    public SlowBuffer(GlobalObject globalObject, long length) {
        super(globalObject);
        buffer = new byte[(int) length];
        setClassName("SlowBuffer");
        put(null, "length", length, false);
        defineReadOnlyProperty(globalObject, "copy", new Copy(globalObject));
        defineReadOnlyProperty(globalObject, "fill", new Fill(globalObject));
        defineReadOnlyProperty(globalObject, "toString", new ToString(globalObject));
    }
    
    public String toString() {
        try {
            return new String(buffer, "UTF8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return new String(buffer);
        }
    }
    
    public void fill(byte b, int offset, int end) {
        if (offset >= buffer.length ) {
            return;
        }
        if (end > buffer.length) {
            throw new ThrowException(null, "end cannot be longer than length");
        }
        for (int i=offset; i < end; i++) {
            buffer[i] = b;
        }
    }
    
    public long copy(byte[] source, int targetStart, int sourceStart, int sourceEnd) {
        if (sourceEnd == sourceStart) {
            return 0L;
        }
        if (sourceStart > sourceEnd) {
            throw new ThrowException(null, "sourceEnd < sourceStart");
        }
        if (targetStart >= buffer.length) {
            throw new ThrowException(null, "targetStart out of bounds");
        }
        if (sourceStart >= source.length) {
            throw new ThrowException(null, "sourceStart out of bounds");
        }
        if (sourceEnd > source.length) {
            throw new ThrowException(null, "sourceEnd out of bounds");
        }
        int counter = 0;
        for (int i = sourceStart; i < sourceEnd; i++) {
            buffer[targetStart+counter] = source[i];
            counter++;
        }
        return counter;
    }
    
    public byte[] getBuffer() {
        return this.buffer;
    }
}