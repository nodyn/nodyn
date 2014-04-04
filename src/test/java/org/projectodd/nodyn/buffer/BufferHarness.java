package org.projectodd.nodyn.buffer;

/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Red Hat licenses this file to you under the Apache License, version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License.  You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * @author <a href="http://lanceball.com">Lance Ball</a>
 */

import java.io.UnsupportedEncodingException;

/**
 * Some test fixtures for bufferSpec.js
 */
public class BufferHarness {
    public static final String TEST_STRING = "Now is the winter of our discontent made glorious summer";
    public static byte[] UTF8_BYTE_STRING;
    public static byte[] ASCII_BYTE_STRING;
    public static byte[] UTF8_TEST_WRITE_BUFFER;

    static {
      try {
        UTF8_BYTE_STRING = TEST_STRING.getBytes("UTF-8");
        ASCII_BYTE_STRING = TEST_STRING.getBytes("US-ASCII");;
        UTF8_TEST_WRITE_BUFFER = "½ + ¼ = ¾".getBytes("UTF-8");
      } catch(Exception e) {
        System.err.println("ERROR: Cannot instantiate test fixtures.");
      }
    }

    public static byte[] toBytes(String string) {
    	return string.getBytes();
    }
}
