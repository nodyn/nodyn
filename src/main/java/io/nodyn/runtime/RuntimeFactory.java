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
package io.nodyn.runtime;

import io.nodyn.Nodyn;
import io.nodyn.runtime.dynjs.DynJSConfig;
import io.nodyn.runtime.dynjs.DynJSRuntime;

/**
 * A factory used to obtain a Nodyn instance.
 *
 * @author Lance Ball
 */
public class RuntimeFactory {

    private final ClassLoader parent;
    private final Runtime engine = Runtime.DYNJS; // we don't support anything but dynjs for now

    RuntimeFactory(ClassLoader parent) {
        this.parent = parent;
    }

    RuntimeFactory() {
        this.parent = null;
    }

    /**
     * Initializes a new RuntimeFactory. At some point, this will provide either a DynJS or a Nashorn
     * runtime depending on env vars, system properties or defaults
     * @return a factory for creating nodyn configuration and runtime instances
     */
    public static RuntimeFactory init() {
        return new RuntimeFactory();
    }

    /**
     * Initializes a new RuntimeFactory.  At some point, this will provide either a DynJS or a Nashorn
     * runtime depending on env vars, system properties or defaults
     *
     * @param parent a parent classloader
     * @return a factory for creating nodyn configuration and runtime instances
     */
    public static RuntimeFactory init(ClassLoader parent) {
        return new RuntimeFactory(parent);
    }

    /**
     * Creates a new Nodyn instance with the configuration provided
     * @param config configuration options for the runtime instance
     * @return the runtime instance
     */
    public Nodyn newRuntime(Config config) {
        return new DynJSRuntime((DynJSConfig) config);
    }

    /**
     * Creates a new configuration for a Nodyn runtime. Config instances can be reused for multiple runtimes.
     * @return a new Config
     */
    public Config newConfiguration() {
        if (parent != null) return new DynJSConfig(parent);
        return new DynJSConfig();
    }


    enum Runtime {
      DYNJS, NASHORN;
    }
}
