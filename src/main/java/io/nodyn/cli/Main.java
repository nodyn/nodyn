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

package io.nodyn.cli;

import io.nodyn.Nodyn;
import io.nodyn.runtime.Config;
import io.nodyn.runtime.RuntimeFactory;
import org.dynjs.exception.ThrowException;
import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.JSObject;

import java.io.IOException;

public class Main {

    private Nodyn nodyn;

    public Main(String[] args) {
        RuntimeFactory factory = RuntimeFactory.init();
        Config config = factory.newConfiguration();
        config.setArgv(args);
        this.nodyn = factory.newRuntime(config);
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        int exitCode = new Main(args).run();
        System.exit(exitCode);
    }

    public int run() {
        // TODO: Add custom handling for Nashorn native exceptions
        try {
            return this.nodyn.run();
        } catch (ThrowException e) {
            Object value = e.getValue();
            if (value != null && value instanceof JSObject) {
                Object stack = ((JSObject) value).get(((DynJS) this.nodyn).getDefaultExecutionContext(), "stack");
                System.err.print(stack);
            } else if ( e.getCause() != null ) {
                e.getCause().printStackTrace();
            } else {
                e.printStackTrace();
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }

        return -255;
    }
}
