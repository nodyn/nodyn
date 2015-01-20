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
package io.nodyn.runtime.nashorn;

import io.nodyn.Nodyn;
import io.nodyn.runtime.NodynConfig;
import io.nodyn.runtime.RuntimeFactory;
import org.vertx.java.core.Vertx;

/**
 * @author Lance Ball
 */
public class NashornFactory extends RuntimeFactory {

    protected NashornFactory(ClassLoader parent) {
        super(parent);
    }

    @Override
    public Nodyn newRuntime(NodynConfig config) {
        return new NashornRuntime(config, null, true);
    }

    @Override
    public Nodyn newRuntime(NodynConfig config, Vertx vertx) {
        return new NashornRuntime(config, vertx, true);
    }

}
