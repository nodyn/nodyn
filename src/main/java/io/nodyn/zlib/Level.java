package io.nodyn.zlib;

import java.util.zip.Deflater;

/**
 * @author Lance Ball
 */
public enum Level {
    Z_NO_COMPRESSION, Z_BEST_SPEED, Z_BEST_COMPRESSION, Z_DEFAULT_COMPRESSION;

    public static int mapDeflaterLevel(Level level) {
        switch(level) {
            case Z_NO_COMPRESSION: return Deflater.NO_COMPRESSION;
            case Z_BEST_SPEED: return Deflater.BEST_SPEED;
            case Z_BEST_COMPRESSION: return Deflater.BEST_COMPRESSION;
            case Z_DEFAULT_COMPRESSION: return Deflater.DEFAULT_COMPRESSION;
            default: return Deflater.DEFAULT_COMPRESSION;
        }
    }

    public static int mapDeflaterLevel(int level) {
        return mapDeflaterLevel(Level.values()[level]);
    }
}
