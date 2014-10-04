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
package io.nodyn.runtime.dynjs;

import io.nodyn.Nodyn;
import io.nodyn.runtime.Config;
import io.nodyn.runtime.RuntimeFactory;

/**
 * @author Lance Ball
 */
public class DynJSFactory extends RuntimeFactory {

    public DynJSFactory(ClassLoader parent) {
        super(parent);
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
        return new DynJSConfig(getParent());
    }
}
