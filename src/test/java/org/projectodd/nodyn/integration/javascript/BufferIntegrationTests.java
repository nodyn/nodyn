package org.projectodd.nodyn.integration.javascript;

import java.io.UnsupportedEncodingException;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.vertx.testtools.ScriptClassRunner;
import org.vertx.testtools.TestVerticleInfo;

/*
 * Copyright 2013 Red Hat, Inc.
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
 * @author Lance Ball
 */

@TestVerticleInfo(filenameFilter = "buffer_.+\\.js", funcRegex = "function[\\s]+(test[^\\s(]+)")
@RunWith(ScriptClassRunner.class)
public class BufferIntegrationTests {
    public static final String TEST_STRING = "Now is the winter of our discontent made glorious summer";
    public static byte[] UTF8_BYTE_STRING;
    public static byte[] ASCII_BYTE_STRING;
    
    @Test
    public void __vertxDummy() {
        try {
            UTF8_BYTE_STRING = TEST_STRING.getBytes("UTF-8");
            UTF8_BYTE_STRING = TEST_STRING.getBytes("US-ASCII");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}
