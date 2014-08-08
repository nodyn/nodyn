package io.nodyn.zlib;

import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.buffer.BufferWrap;

import java.util.HashMap;
import java.util.Map;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

/**
 * Provides a process binding for zlib functions as expected by zlib.js
 * Used by nodyn/bindings/zlib.js
 * @author Lance Ball
 */
public class NodeZlib extends EventSource {
    private int level;
    private Mode mode;
    private Strategy strategy;
    private String dictionary;

    public NodeZlib(int mode) {
        this.mode = Mode.values()[mode];
    }

    public void init(int windowBits, int level, int memLevel, int strategy, String dictionary) {
        this.level = level;
        this.strategy = Strategy.values()[strategy];
        this.dictionary = dictionary;
    }

    public void params(int level, int strategy) {
        this.level = level;
        this.strategy = Strategy.values()[strategy];
    }

    public void reset() {
        this.level = Level.Z_DEFAULT_COMPRESSION.ordinal();
        this.strategy = Strategy.Z_DEFAULT_STRATEGY;
        this.mode = Mode.DEFLATE;
    }

    public void close() {
        // umm?
    }

    public void write(int flush, byte[] chunk, int inOffset, int inLen, BufferWrap buffer, int outOffset, int outLen) {
        __write(flush, chunk, inOffset, inLen, buffer, outOffset, outLen);
    }

    public void writeSync(int flush, byte[] chunk, int inOffset, int inLen, BufferWrap buffer, int outOffset, int outLen) {
        System.err.println("NodeZlib#writeSync()");
        __write(flush, chunk, inOffset, inLen, buffer, outOffset, outLen);
    }

    private void __write(int flush, byte[] chunk, int inOffset, int inLen, BufferWrap buffer, int outOffset, int outLen) {
        switch(this.mode) {
            case DEFLATE:
            case GZIP:
                deflate(flush, chunk, inOffset, inLen, buffer, outOffset, outLen);
                break;
            case INFLATE:
            case GUNZIP:
                inflate(flush, chunk, inOffset, inLen, buffer, outOffset, outLen);
                break;
            default:
                System.err.println("ERROR: Don't know how to handle " + this.mode);
        }
    }

    private void inflate(int flush, byte[] chunk, int inOffset, int inLen, BufferWrap buffer, int outOffset, int outLen) {
        if (chunk == null || chunk.length == 0) {
            after(null, 0, outLen);
            return;
        }
        Inflater inflater = new Inflater(this.mode == Mode.GUNZIP);
        inflater.setInput(chunk, inOffset, inLen);
        byte[] output = new byte[chunk.length*2];
        try {
            int inflatedLen = inflater.inflate(output);
            inflater.end();
            new BufferWrap(output).copy(buffer, outOffset, 0, inflatedLen);
            after(output, 0, outLen - inflatedLen);
        } catch (DataFormatException e) {
            e.printStackTrace();
        }
    }

    private void deflate(int flush, byte[] chunk, int inOffset, int inLen, BufferWrap buffer, int outOffset, int outLen) {
        if (chunk == null || chunk.length == 0) {
            after(null, 0, outLen);
            return;
        }
        Deflater deflater = new Deflater(Level.mapDeflaterLevel(this.level), this.mode == Mode.GZIP);
        deflater.setStrategy(Strategy.mapDeflaterStrategy(this.strategy));
        deflater.setInput(chunk, inOffset, inLen);
        deflater.finish();
        byte[] output = new byte[chunk.length];
        int compressedLength = deflater.deflate(output);
        deflater.end();
        new BufferWrap(output).copy(buffer, outOffset, 0, compressedLength);
        after(output, 0, outLen - compressedLength);
    }

    private void after(byte[] output, int inAfter, int outAfter) {
        Map result = new HashMap();
        result.put("output", output);
        result.put("inAfter", inAfter);
        result.put("outAfter", outAfter);
        this.emit("after", CallbackResult.createSuccess(result));
    }

}
