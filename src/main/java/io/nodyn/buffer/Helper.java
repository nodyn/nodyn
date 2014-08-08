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

package io.nodyn.buffer;

import java.io.UnsupportedEncodingException;

/**
 * @author Bob McWhirter
 */
public class Helper {

    public static byte[] newByteArray(int len) {
        return new byte[len];
    }

    public static byte[] bytes(String string, String enc) throws UnsupportedEncodingException {
        byte[] bytes = string.getBytes(enc);
        return bytes;
    }

    public static char[] characters(String string) throws UnsupportedEncodingException {
        return string.toCharArray();
    }

}
