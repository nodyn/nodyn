package io.nodyn.zlib;

import io.nodyn.CallbackResult;
import io.nodyn.EventSource;

import java.util.HashMap;
import java.util.Map;
import java.util.zip.Deflater;

/**
 * Provides a process binding for zlib functions as expected by zlib.js
 * Used by nodyn/bindings/zlib.js
 * @author Lance Ball
 */
public class NodeZlib extends EventSource {
    private int level;
    private Mode mode;
    private Strategy strategy;

    public NodeZlib(int mode) {
        this.mode = Mode.values()[mode];
    }

    public void init(int windowBits, int level, int memLevel, int strategy, String dictionary) {
        this.level = level;
        this.strategy = Strategy.values()[strategy];
    }

    public void params(int level, int strategy) {
        this.level = level;
        this.strategy = Strategy.values()[strategy];
    }

    public void reset() {
        this.level = Strategy.Z_DEFAULT_COMPRESSION.ordinal();
        this.strategy = Strategy.Z_DEFAULT_STRATEGY;
        this.mode = Mode.DEFLATE;
    }

    public void close() {
        // umm?
    }

    public String write(int flush, byte[] chunk, int inOffset, int inLen, int outOffset, int outLen) {
        return __write(flush, chunk, inOffset, inLen, outOffset, outLen);
    }

    public String writeSync(int flush, byte[] chunk, int inOffset, int inLen, int outOffset, int outLen) {
        System.err.println("NodeZlib#writeSync()");
        return __write(flush, chunk, inOffset, inLen, outOffset, outLen);
    }

    private String __write(int flush, byte[] chunk, int inOffset, int inLen, int outOffset, int outLen) {
        switch(this.mode) {
            case DEFLATE: return deflate(flush, chunk, inOffset, inLen, outOffset, outLen);
        }
        return null;
    }

    private String deflate(int flush, byte[] chunk, int inOffset, int inLen, int outOffset, int outLen) {
        if (chunk == null || chunk.length == 0) {
            after(null, 0, outLen);
            return null;
        }
        Deflater deflater = new Deflater(this.level);
        deflater.setInput(chunk, inOffset, inLen);
        deflater.finish();
        byte[] output = new byte[chunk.length*2]; // shouldn't be longer than 2x the input :)
        int compressedLength = deflater.deflate(output);
        deflater.end();
        after(output, 0, outLen - compressedLength);
        return new String(output);
    }

    private void after(byte[] output, int inAfter, int outAfter) {
        Map result = new HashMap();
        result.put("output", output);
        result.put("outAfter", outAfter);
        result.put("inAfter", inAfter);
        this.emit("after", CallbackResult.createSuccess(result));
    }

}
