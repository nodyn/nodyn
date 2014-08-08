package io.nodyn.zlib;

import java.util.zip.Deflater;

/**
 * @author Lance Ball
 */
public enum Strategy {
    Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY, ZLIB_VERNUM;

    public static int mapDeflaterStrategy(Strategy strategy) {
        switch(strategy) {
            case Z_FILTERED: return Deflater.FILTERED;
            case Z_HUFFMAN_ONLY: return Deflater.HUFFMAN_ONLY;
            case Z_RLE: return Deflater.DEFAULT_STRATEGY; // ?? TODO
            case Z_FIXED: return Deflater.DEFAULT_STRATEGY; // ?? TODO
            case ZLIB_VERNUM: return Deflater.DEFAULT_STRATEGY; // ?? TODO
            default: return Deflater.DEFAULT_STRATEGY;
        }
    }

    public static int mapDeflaterStrategy(int strategy) {
        return mapDeflaterStrategy(Strategy.values()[strategy]);
    }


}
