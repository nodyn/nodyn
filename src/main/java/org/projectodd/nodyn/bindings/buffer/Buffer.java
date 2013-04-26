package org.projectodd.nodyn.bindings.buffer;

import java.io.UnsupportedEncodingException;

import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.DynArray;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.PropertyDescriptor;
import org.dynjs.runtime.Types;
import org.projectodd.nodyn.bindings.buffer.prototype.Copy;
import org.projectodd.nodyn.bindings.buffer.prototype.Fill;
import org.projectodd.nodyn.bindings.buffer.prototype.Slice;
import org.projectodd.nodyn.bindings.buffer.prototype.ToString;
import org.projectodd.nodyn.bindings.buffer.prototype.Write;

public class Buffer extends DynObject {
    public enum Encoding {
        // Implemented
        UTF8, ASCII, UTF16LE, UCS2,
        // Not implemented
        BASE64, BINARY, HEX
    }

    public long _charsWritten = 0;
    private long length = 0;
    
    private GlobalObject global;
    private Encoding encoding = Encoding.UTF8;
    private org.vertx.java.core.buffer.Buffer delegate;
    
    public Buffer(final GlobalObject globalObject, long length) {
        this(globalObject, "", length, Encoding.UTF8);
    }

    public Buffer(GlobalObject globalObject, DynArray items) {
        this(globalObject, "", Types.toUint32(null, items.get(null, "length")), Encoding.UTF8);
        for(int i=0; i<length; i++) {
            String c = Types.toString(null, items.get(null, "" + i));
            delegate.appendString(c);
        }
    }

    public Buffer(final GlobalObject globalObject, String str, long length, Encoding encoding) {
        super(globalObject);
        this.global   = globalObject;
        this.encoding = encoding;
        this.length   = length;
        this.delegate = new org.vertx.java.core.buffer.Buffer(str, BufferType.getCharset(encoding));
        initializeProperties();
    }
    
    public void fill(byte b, int offset, int end) {
        for (int i=offset; i < end; i++) {
            this.delegate.setByte(i, b);
        }
    }
    
    public long copy(Buffer source, int targetStart, int sourceStart, int sourceEnd) {
        if (sourceEnd == sourceStart) {
            return 0L;
        }
        if (sourceStart > sourceEnd) {
            throw new ThrowException(null, "sourceEnd < sourceStart");
        }
        if (sourceStart >= source.length) {
            throw new ThrowException(null, "sourceStart out of bounds");
        }
        if (sourceEnd > source.length) {
            throw new ThrowException(null, "sourceEnd out of bounds");
        }
        
        int l = sourceEnd - sourceStart;
        if (targetStart > this.length - l) {
            this.length = this.length + l;
            put("length", this.length);
        }
        delegate.setBuffer(targetStart, source.delegate.getBuffer(sourceStart, sourceEnd));
        return sourceEnd - sourceStart;
    }
    
    @Override
    public String toString() {
        return delegate.toString(BufferType.getCharset(encoding));
    }

    @Override
    public void put(ExecutionContext context, final String name, final Object value, final boolean shouldThrow) {
        Number possibleIndex = Types.toNumber(context, name);
        if (isIndex(name)) {
            Long numberValue = Types.toUint32(context, value);
//            System.err.println("BUFFER PUT INDEX: " + possibleIndex);
//            System.err.println("BUFFER REQUESTED PUT: " + value);
//            System.err.println("BUFFER PUT: " + (numberValue.byteValue() & 0xff));
            int val = (numberValue.byteValue() & 0xff);
            delegate.setInt(possibleIndex.intValue(), val);
        } else {
            super.put(context, name, value, shouldThrow);
        }
    }
    
    @Override
    public Object getOwnProperty(ExecutionContext context, String name) {
        if (isIndex(name)) {
            int value = this.delegate.getInt(Types.toInteger(context, name).intValue());
            PropertyDescriptor desc = new PropertyDescriptor();
            desc.set(name, value);
            desc.setConfigurable(true);
            desc.setEnumerable(true);
            desc.setWritable(true);
            desc.setValue(value);
//            System.err.println("BUFFER RETREIVE: " + value);
//            System.err.println("BUFFER RETREIVE INDEX: " + name);
            return desc;
        }
        return super.getOwnProperty(context, name);
    }
    
    public long write(String string, Encoding encoding, int offset, int maxLength) {
        int length = Math.min(maxLength, string.length());
        if (length == 0) { return 0; }
        try {
            byte[] bytes = string.substring(0, length).getBytes(BufferType.getCharset(encoding));
            delegate.setBytes(offset, bytes);
            put("_charsWritten", length);
            return bytes.length;
        } catch (UnsupportedEncodingException e) {
        }
        return 0;
    }


    // TODO: Or not todo, that is the question... node.js slices reference
    // *the same* underlying memory, so changes to one buffer are reflected
    // in its slices. Is this a feature or side effect?
    public Object slice(int start, int end) {
        Buffer buffer = new Buffer(this.global, end-start);
//        buffer.copy(this.getBuffer(), 0, start, end);
        return buffer;
    }
    
    public long getLength() {
        return this.length;
    }

    private void initializeProperties() {
        setClassName("Buffer");
        put(null, "length", length, false);
        defineReadOnlyProperty(global, "delegate", delegate);
        defineReadOnlyProperty(global, "copy", new Copy(global));
        defineReadOnlyProperty(global, "fill", new Fill(global));
        defineReadOnlyProperty(global, "write", new Write(global, this.encoding));
        defineReadOnlyProperty(global, "utf8Write", new Write(global, Buffer.Encoding.UTF8));
        defineReadOnlyProperty(global, "asciiWrite", new Write(global, Buffer.Encoding.ASCII));
        defineReadOnlyProperty(global, "toString", new ToString(global));
        defineReadOnlyProperty(global, "utf8Slice", new Slice(global, Buffer.Encoding.UTF8));
        defineReadOnlyProperty(global, "asciiSlice", new Slice(global, Buffer.Encoding.ASCII));
    }
    
    private boolean isIndex(String name) {
        Double possibleIndex = Types.toNumber(null, name).doubleValue();
        return (!possibleIndex.isInfinite() && !possibleIndex.isNaN());
    }
    
}
