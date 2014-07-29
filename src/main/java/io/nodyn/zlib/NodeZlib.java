package io.nodyn.zlib;

import io.nodyn.EventSource;
import org.dynjs.runtime.DynObject;
import org.vertx.java.core.buffer.Buffer;

import java.util.zip.Deflater;

/**
 * Provides a process binding for zlib functions as expected by zlib.js
 * @author Lance Ball
 */
public class NodeZlib extends EventSource {
    private final Mode mode;
    private int level;
    private Strategy strategy;

    public NodeZlib(int mode) {
        this.mode = Mode.values()[mode];
        System.err.println("NodeZlib#ctor()");
        System.err.println("NodeZlib#mode: " + this.mode);
    }

    public void init(int windowBits, int level, int memLevel, int strategy, String dictionary) {
        this.level = level;
        this.strategy = Strategy.values()[strategy];
        System.err.println("NodeZlib#init()");
        System.err.println("NodeZlib#level: " + this.level);
        System.err.println("NodeZlib#strategy: " + this.strategy);
        System.err.println("NodeZlib#dictionary: " + dictionary);
    }

    public void params(int level, int strategy) {
        this.level = level;
        this.strategy = Strategy.values()[strategy];
        System.err.println("NodeZlib#params()");
        System.err.println("NodeZlib#level: " + this.level);
        System.err.println("NodeZlib#strategy: " + this.strategy);
    }

    public void reset() {
        System.err.println("NodeZlib#reset()");
    }

    public void close() {
        System.err.println("NodeZlib#close()");
    }

    public Buffer write(int flush, Buffer chunk, int inOffset, int inLen, Buffer outBuffer, int outOffset, int outLen) {
        System.err.println("NodeZlib#write()");
        return __write(flush, chunk, inOffset, inLen, outBuffer, outOffset, outLen);
    }

    public Buffer writeSync(int flush, Buffer chunk, int inOffset, int inLen, Buffer outBuffer, int outOffset, int outLen) {
        System.err.println("NodeZlib#writeSync()");
        return __write(flush, chunk, inOffset, inLen, outBuffer, outOffset, outLen);
    }

    private Buffer __write(int flush, Buffer chunk, int inOffset, int inLen, Buffer outBuffer, int outOffset, int outLen) {
        switch(this.mode) {
            case DEFLATE: return deflate(flush, chunk, inOffset, inLen, outBuffer, outOffset, outLen);
        }
        return new Buffer("Mode not implemented: " + this.mode);
    }

    private Buffer deflate(int flush, Buffer chunk, int inOffset, int inLen, Buffer outBuffer, int outOffset, int outLen) {
        Deflater deflater = new Deflater(this.level);
        deflater.setInput(chunk.getBytes(), inOffset, inLen);
        deflater.finish();
        byte[] output = new byte[chunk.length()*2]; // shouldn't be longer than 2x the input :)
        outLen = deflater.deflate(output);
        deflater.end();
        outBuffer.setBytes(outOffset, output, 0, outLen);
        return outBuffer;
    }

}
