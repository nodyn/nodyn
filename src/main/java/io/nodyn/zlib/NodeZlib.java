package io.nodyn.zlib;

import io.nodyn.EventSource;
import org.vertx.java.core.buffer.Buffer;

/**
 * Provides a process binding for zlib functions as expected by zlib.js
 * @author Lance Ball
 */
public class NodeZlib extends EventSource {
    private final Mode mode;

    public NodeZlib(int mode) {
        this.mode = Mode.values()[mode];
    }

    public void init(int windowBits, int level, int memLevel, int strategy, String dictionary) {

    }

    public void params(int level, int strategy) {

    }

    public void reset() {

    }

    public void close() {

    }

    public void write(int flush, Buffer chunk, int inOffset, int inLen, Buffer outBuffer, int outOffset, int outLen) {

    }

    public void writeSync(int flush, Buffer chunk, int inOffset, int inLen, Buffer outBuffer, int outOffset, int outLen) {

    }

}
