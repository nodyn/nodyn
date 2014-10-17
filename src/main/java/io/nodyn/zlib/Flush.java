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
public enum Flush {
    Z_NO_FLUSH, Z_PARTIAL_FLUSH, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH, Z_BLOCK;

    public static int mapFlush(Flush flush) {
        switch(flush) {
            case Z_NO_FLUSH: return Deflater.NO_FLUSH;
            case Z_SYNC_FLUSH: return Deflater.SYNC_FLUSH;
            case Z_FULL_FLUSH: return Deflater.FULL_FLUSH;
            default: return Deflater.NO_FLUSH;
        }
    }

    public static int mapFlush(int flush) {
        return mapFlush(Flush.values()[flush]);
    }

}
