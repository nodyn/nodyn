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
import io.nodyn.runtime.dynjs.DynJSFactory;
import org.vertx.java.core.Vertx;

/**
 * A factory used to obtain a Nodyn instance.
 *
 * @author Lance Ball
 */
public abstract class RuntimeFactory {

    private final ClassLoader parent;

    protected RuntimeFactory(ClassLoader parent) {
        this.parent = parent;
    }

    /**
     * Initializes a new RuntimeFactory.  At some point, this will provide either a DynJS or a Nashorn
     * runtime depending on env vars, system properties or defaults
     *
     * @param parent a parent classloader
     * @return a factory for creating nodyn configuration and runtime instances
     */
    public static RuntimeFactory init(ClassLoader parent, RuntimeType runtimeType) {
        if (runtimeType == RuntimeType.DYNJS) {
            return new DynJSFactory(parent);
        }
        // TODO: Implement NashornFactory
        throw new RuntimeException("Not implemented: " + runtimeType);
    }

    public ClassLoader getParent() {
        return parent;
    }

    /**
     * Creates a new runtime using the configuration options provided
     * @param config configuration options
     * @return the new Nodyn runtime
     */
    abstract public Nodyn newRuntime(NodynConfig config);

    /**
     * Creates a new runtime using the vertx instance and configuration options provided
     * @param vertx The vertx instance to use for vertx interop
     * @param config The configuration options
     * @return the new Nodyn runtime
     */
    abstract public Nodyn newRuntime(Vertx vertx, NodynConfig config);

    public enum RuntimeType {
      DYNJS, NASHORN
    }
}
