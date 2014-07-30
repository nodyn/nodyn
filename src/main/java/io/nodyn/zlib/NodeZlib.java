package io.nodyn.zlib;

import io.nodyn.EventSource;
import org.vertx.java.core.buffer.Buffer;

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

    public byte[] write(int flush, byte[] chunk, int inOffset, int inLen) {
        System.err.println("NodeZlib#write()");
        return __write(flush, chunk, inOffset, inLen);
    }

    public byte[] writeSync(int flush, byte[] chunk, int inOffset, int inLen) {
        System.err.println("NodeZlib#writeSync()");
        return __write(flush, chunk, inOffset, inLen);
    }

    private byte[] __write(int flush, byte[] chunk, int inOffset, int inLen) {
        switch(this.mode) {
            case DEFLATE: return deflate(flush, chunk, inOffset, inLen);
        }
        return null;
    }

    private byte[] deflate(int flush, byte[] chunk, int inOffset, int inLen) {
        System.err.println("NodeZlib#deflate()");
        Deflater deflater = new Deflater(this.level);
        System.err.println("SETTING INPUT " + chunk);
        deflater.setInput(chunk, inOffset, inLen);
        deflater.finish();
        byte[] output = new byte[chunk.length*2]; // shouldn't be longer than 2x the input :)
        deflater.end();
        return output;
    }

}
