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
import io.nodyn.handle.HandleWrap;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.zip.*;

/**
 * Provides a process binding for zlib functions as expected by zlib.js
 * Used by nodyn/bindings/zlib.js
 * @author Lance Ball
 */
public class NodeZlib extends HandleWrap {

    public NodeZlib(NodeProcess process, int mode) {
        super(process, false);
        this.mode = Mode.values()[mode];
    }

    public void init(int windowBits, int level, int memLevel, int strategy, byte[] dictionary) {
        // TODO: We don't (can't?) set windowBits and memLevel in Java the way you can in native zlib
        this.level = level;
        this.strategy = Strategy.mapDeflaterStrategy(strategy);
        this.dictionary = dictionary;
        this.initDone.set(true);
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
        if (writeInProgress.get()) {
            pendingClose.set(true);
            return;
        }
        this.mode = Mode.NONE;
        this.closed.set(true);
        this.unref();
    }

    public void write(final int flush, final byte[] chunk, final int inOffset, final int inLen, final ByteBuf buffer, final int outOffset, final int outLen) {
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
        if (check(initDone.get(), "write before init") &&
            check(!pendingClose.get(), "close is pending") &&
            check(!closed.get(), "already finalized") &&
            check(!writeInProgress.get(), "write already in progress")) {
            this.writeInProgress.set(true);
            this.ref();
            if (chunk == null || chunk.length == 0) {
                after(this, null, 0, outLen);
                return;
            }
            switch(this.mode) {
                case DEFLATE:
                    deflate(this, flush, chunk, inOffset, inLen, buffer, outOffset, outLen, false);
                    break;
                case DEFLATERAW:
                    deflate(this, flush, chunk, inOffset, inLen, buffer, outOffset, outLen, true);
                    break;
                case GZIP:
                    gzip(this, flush, chunk, inOffset, inLen, buffer, outOffset, outLen);
                    break;
                case INFLATE:
                    inflate(this, flush, chunk, inOffset, inLen, buffer, outOffset, outLen, false);
                    break;
                case INFLATERAW:
                    inflate(this, flush, chunk, inOffset, inLen, buffer, outOffset, outLen, true);
                    break;
                case GUNZIP:
                    gunzip(this, flush, chunk, inOffset, inLen, buffer, outOffset, outLen);
                    break;
                case NONE:
                    break;
                default:
                    this.process.getNodyn().handleThrowable(new RuntimeException("ERROR: Don't know how to handle " + this.mode));
            }
            this.writeInProgress.set(false);
        }
    }

    private static void gunzip(NodeZlib ctx, int flush, byte[] chunk, int inOffset, int inLen, ByteBuf buffer, int outOffset, int outLen) throws IOException {
        GZIPInputStream inputStream = new GZIPInputStream(new ByteArrayInputStream(chunk));
        byte[] result = new byte[outLen];
        int bytesRead = inputStream.read(result, inOffset, Math.min(inLen, result.length));
        inputStream.close();
        buffer.setBytes(outOffset, result, 0, bytesRead);
        after(ctx, result, 0, outLen - bytesRead);
    }

    private static void gzip(final NodeZlib ctx, int flush, byte[] chunk, int inOffset, int inLen, ByteBuf buffer, int outOffset, int outLen) throws IOException {
        final ByteArrayOutputStream output = new ByteArrayOutputStream(outLen);
        GZIPOutputStream outputStream = new GZIPOutputStream(output){
            {
                this.def.setLevel(Level.mapDeflaterLevel(ctx.level));
                this.def.setStrategy(ctx.strategy);
            }
        };
        outputStream.write(chunk, inOffset, inLen);
        outputStream.finish();
        final byte[] bytes = output.toByteArray();
        buffer.setBytes(outOffset, bytes, 0, Math.min(bytes.length, outLen));
        after(ctx, bytes, 0, outLen - bytes.length);
    }

    private static void inflate(NodeZlib ctx, int flush, byte[] chunk, int inOffset, int inLen, ByteBuf buffer, int outOffset, int outLen, boolean raw) throws DataFormatException {
        Inflater inflater = new Inflater(raw);
        inflater.setInput(chunk, inOffset, inLen);
        byte[] output = new byte[chunk.length*2];

        int inflatedLen = inflater.inflate(output);
        if (inflater.needsDictionary()) {
            if (ctx.dictionary == null) {
                ctx.emit("error", CallbackResult.createError(new RuntimeException("Missing dictionary")));
                return;
            } else {
                try {
                    inflater.setDictionary(ctx.dictionary);
                    inflatedLen = inflater.inflate(output);
                } catch(Throwable t) {
                    ctx.emit("error", CallbackResult.createError(new RuntimeException("Bad dictionary")));
                }
            }
        }
        inflater.end();
        buffer.setBytes( outOffset, output, 0, inflatedLen );
        after(ctx, Arrays.copyOf(output, inflatedLen), 0, outLen - inflatedLen);
    }

    private static void deflate(NodeZlib ctx, int flush, byte[] chunk, int inOffset, int inLen, ByteBuf buffer, int outOffset, int outLen, boolean raw) {
        Deflater deflater = new Deflater(Level.mapDeflaterLevel(ctx.level), raw);
        deflater.setStrategy(ctx.strategy);
        deflater.setLevel(Level.mapDeflaterLevel(ctx.level));
        if (ctx.dictionary != null) deflater.setDictionary(ctx.dictionary);
        deflater.setInput(chunk, inOffset, inLen);
        deflater.finish();
        byte[] output = new byte[chunk.length];
        int compressedLength = deflater.deflate(output, 0, output.length, Flush.mapFlush(flush));
        deflater.end();
        buffer.setBytes( outOffset, output, 0, compressedLength );
        after(ctx, Arrays.copyOf(output, compressedLength), 0, outLen - compressedLength);
    }

    private static void after(NodeZlib ctx, byte[] output, int inAfter, int outAfter) {
        Map result = new HashMap();
        result.put("output", output);
        result.put("inAfter", inAfter);
        result.put("outAfter", outAfter);
        ctx.emit("after", CallbackResult.createSuccess(result));
    }

    private boolean check(boolean bool, String msg) {
        if (!bool) {
            emit("error", CallbackResult.createError(new RuntimeException(msg)));
        }
        return bool;
    }

    private Mode mode;
    private int strategy;
    private byte[] dictionary;
    private int level;
    private AtomicBoolean initDone = new AtomicBoolean(false);
    private AtomicBoolean writeInProgress = new AtomicBoolean(false);
    private AtomicBoolean closed = new AtomicBoolean(false);
    private AtomicBoolean pendingClose = new AtomicBoolean(false);

}
