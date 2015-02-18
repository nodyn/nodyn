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
package io.nodyn;

import io.nodyn.runtime.NodynConfig;
import io.nodyn.runtime.RuntimeFactory;

/**
 * @author lanceball
 */
public class TestRunner {

    private static final String SCRIPT = "" +
            "var executor = require('./target/test-classes/specRunner.js');" +
            "executor.run('" + testPattern() + "');";

    public static String testPattern() {
        String pattern = System.getProperty("test.pattern");
        if (pattern == null) {
            pattern = "**/*Spec.js";
        }

        return pattern;
    }

    public static void main(String... args) throws InterruptedException {
        System.setProperty( "nodyn.binary", "./bin/node" );

        RuntimeFactory factory = RuntimeFactory.init(TestRunner.class.getClassLoader(), RuntimeFactory.RuntimeType.NASHORN);
        NodynConfig config = new NodynConfig( new String[] { "-e", SCRIPT } );
        Nodyn nodyn = factory.newRuntime(config);
        nodyn.setExitHandler( new NoOpExitHandler() );
        try {
            int exitCode = nodyn.run();
            if (exitCode != 0) {
                throw new TestFailureException();
            }
        } catch (Throwable t) {
            throw new TestFailureException( t );
        }
    }
}
