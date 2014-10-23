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

package io.nodyn.zlib;

import io.netty.buffer.ByteBuf;
import io.nodyn.CallbackResult;
import io.nodyn.NodeProcess;
import io.nodyn.async.AsyncWrap;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.*;

/**
 * Provides a process binding for zlib functions as expected by zlib.js
 * Used by nodyn/bindings/zlib.js
 * @author Lance Ball
 */
public class NodeZlib extends AsyncWrap {
    private final Mode mode;
    private int strategy;
    private byte[] dictionary;
    private int level;
    private boolean closed = false;

    public NodeZlib(NodeProcess process, int mode) {
        super(process);
        this.mode = Mode.values()[mode];
    }

    public void init(int windowBits, int level, int memLevel, int strategy, byte[] dictionary) {
        // TODO: We don't (can't?) set windowBits and memLevel in Java the way you can in native zlib
        this.level = level;
        this.strategy = Strategy.mapDeflaterStrategy(strategy);
        this.dictionary = dictionary;
    }

    public void params(int level, int strategy) {
        this.level = level;
        this.strategy = Strategy.mapDeflaterStrategy(strategy);
    }

    public void reset() {
        this.level = Level.Z_DEFAULT_COMPRESSION.ordinal();
        this.strategy = Strategy.Z_DEFAULT_STRATEGY.ordinal();
    }

    public void close() {
        this.closed = true;
    }

    public void write(final int flush, final byte[] chunk, final int inOffset, final int inLen, final ByteBuf buffer, final int outOffset, final int outLen) {
        if (closed) {
            NodeZlib.this.emit("error", CallbackResult.createError(new RuntimeException("Cannot write after close")));
        }
        process.getEventLoop().submitBlockingTask(new Runnable() {
            @Override
            public void run() {
                try {
                    __write(flush, chunk, inOffset, inLen, buffer, outOffset, outLen);
                } catch (Throwable t) {
                    System.err.println("Got error " + t);
                    t.printStackTrace();
                    NodeZlib.this.emit("error", CallbackResult.createError(t));
                }
            }
        });
    }

    public void writeSync(int flush, byte[] chunk, int inOffset, int inLen, ByteBuf buffer, int outOffset, int outLen) throws IOException, DataFormatException {
        __write(flush, chunk, inOffset, inLen, buffer, outOffset, outLen);
    }

    private void __write(int flush, byte[] chunk, int inOffset, int inLen, ByteBuf buffer, int outOffset, int outLen) throws IOException, DataFormatException {
        if (checkChunk(chunk, outLen)) return;
        switch(this.mode) {
            case DEFLATE:
                deflate(flush, chunk, inOffset, inLen, buffer, outOffset, outLen, false);
                break;
            case DEFLATERAW:
                deflate(flush, chunk, inOffset, inLen, buffer, outOffset, outLen, true);
                break;
            case GZIP:
                gzip(flush, chunk, inOffset, inLen, buffer, outOffset, outLen);
                break;
            case INFLATE:
                inflate(flush, chunk, inOffset, inLen, buffer, outOffset, outLen, false);
                break;
            case INFLATERAW:
                inflate(flush, chunk, inOffset, inLen, buffer, outOffset, outLen, true);
                break;
            case GUNZIP:
                gunzip(flush, chunk, inOffset, inLen, buffer, outOffset, outLen);
                break;
            default:
                this.process.getNodyn().handleThrowable(new RuntimeException("ERROR: Don't know how to handle " + this.mode));
        }
    }

    private void gunzip(int flush, byte[] chunk, int inOffset, int inLen, ByteBuf buffer, int outOffset, int outLen) throws IOException {
        GZIPInputStream inputStream = new GZIPInputStream(new ByteArrayInputStream(chunk));
        byte[] result = new byte[outLen];
//        System.err.println(">>>>>>>>>>>>>>>>>>>>>>>>>> GUNZIP");
//        System.err.println("OUT OFFSET " + outOffset);
//        System.err.println("IN OFFSET " + inOffset);
//        System.err.println("IN LEN " + inLen);
//        System.err.println("OUT LEN " + outLen);
//        System.err.println("RESULT LEN " + result.length);
//        System.err.println("CAPACITY " + buffer.capacity());
        int bytesRead = inputStream.read(result, inOffset, Math.min(inLen, result.length));
//        System.err.println("READ " + bytesRead);
//        System.err.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
        inputStream.close();
        buffer.setBytes(outOffset, result, 0, bytesRead);
        after(result, 0, outLen - bytesRead);
    }

    private void gzip(int flush, byte[] chunk, int inOffset, int inLen, ByteBuf buffer, int outOffset, int outLen) throws IOException {
        final ByteArrayOutputStream output = new ByteArrayOutputStream(outLen);
        GZIPOutputStream outputStream = new GZIPOutputStream(output){
            {
                this.def.setLevel(Level.mapDeflaterLevel(NodeZlib.this.level));
                this.def.setStrategy(NodeZlib.this.strategy);
            }
        };
        outputStream.write(chunk, inOffset, inLen);
        outputStream.finish();
        final byte[] bytes = output.toByteArray();
        buffer.setBytes(outOffset, bytes, 0, Math.min(bytes.length, outLen));
        after(bytes, 0, outLen - bytes.length);
    }

    private void inflate(int flush, byte[] chunk, int inOffset, int inLen, ByteBuf buffer, int outOffset, int outLen, boolean raw) throws DataFormatException {
        Inflater inflater = new Inflater(raw);
        inflater.setInput(chunk, inOffset, inLen);
        byte[] output = new byte[chunk.length*2];
//        System.err.println(">>>>>>>>>>>>>>>>>>>>>>>>>> INFLATE");
//        System.err.println("IN OFFSET " + inOffset);
//        System.err.println("OUT OFFSET " + outOffset);
//        System.err.println("IN LEN " + inLen);
//        System.err.println("OUT LEN " + outLen);
//        System.err.println("RESULT LEN " + output.length);
//        System.err.println("CAPACITY " + buffer.capacity());

        int inflatedLen = inflater.inflate(output);
        if (inflater.needsDictionary()) {
            if (this.dictionary == null) {
                this.emit("error", CallbackResult.createError(new RuntimeException("Missing dictionary")));
                return;
            } else {
                try {
                    inflater.setDictionary(this.dictionary);
                    inflatedLen = inflater.inflate(output);
                } catch(Throwable t) {
                    this.emit("error", CallbackResult.createError(new RuntimeException("Bad dictionary")));
                }
            }
        }
//        System.err.println("INFLATED LEN " + inflatedLen);
//        System.err.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
        inflater.end();
        buffer.setBytes( outOffset, output, 0, inflatedLen );
        after(output, 0, outLen - inflatedLen);
    }

    private void deflate(int flush, byte[] chunk, int inOffset, int inLen, ByteBuf buffer, int outOffset, int outLen, boolean raw) {
        Deflater deflater = new Deflater(Level.mapDeflaterLevel(this.level), raw);
        deflater.setStrategy(this.strategy);
        if (this.dictionary != null) deflater.setDictionary(this.dictionary);
        deflater.setInput(chunk, inOffset, inLen);
        deflater.finish();
        byte[] output = new byte[chunk.length];
//        System.err.println(">>>>>>>>>>>>>>>>>>>>>>>>>> DEFLATE");
//        System.err.println("IN OFFSET " + inOffset);
//        System.err.println("OUT OFFSET " + outOffset);
//        System.err.println("IN LEN " + inLen);
//        System.err.println("OUT LEN " + outLen);
//        System.err.println("RESULT LEN " + output.length);
//        System.err.println("CAPACITY " + buffer.capacity());
        int compressedLength = deflater.deflate(output, 0, output.length, Flush.mapFlush(flush));
//        System.err.println("COMPRESSED LEN " + compressedLength);
//        System.err.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
        deflater.end();
        buffer.setBytes( outOffset, output, 0, compressedLength );
        after(output, 0, outLen - compressedLength);
    }

    private boolean checkChunk(byte[] chunk, int outLen) {
        if (chunk == null || chunk.length == 0) {
            after(null, 0, outLen);
            return true;
        }
        return false;
    }

    private void after(byte[] output, int inAfter, int outAfter) {
        Map result = new HashMap();
        result.put("output", output);
        result.put("inAfter", inAfter);
        result.put("outAfter", outAfter);
        this.emit("after", CallbackResult.createSuccess(result));
    }

}
