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
public enum Level {
    Z_NO_COMPRESSION, Z_BEST_SPEED, Z_BEST_COMPRESSION, Z_DEFAULT_COMPRESSION;

    public static int mapDeflaterLevel(int level) {
        switch(level) {
            case 0:
                return Deflater.NO_COMPRESSION;
            case 1:
                return Deflater.BEST_SPEED;
            case 3:
                return Deflater.DEFAULT_COMPRESSION;
            case 9:
                return Deflater.BEST_COMPRESSION;
            case -1:
                return Deflater.DEFAULT_COMPRESSION;
        }
        return level;
    }
}
