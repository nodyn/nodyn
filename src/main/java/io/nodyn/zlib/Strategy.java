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
