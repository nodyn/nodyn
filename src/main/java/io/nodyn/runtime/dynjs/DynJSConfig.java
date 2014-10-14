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

import io.nodyn.runtime.Config;
import org.dynjs.runtime.DynamicClassLoader;

/**
 * @author lanceball
 */
public class DynJSConfig extends org.dynjs.Config implements Config {

    private boolean isClustered;
    private String host;

    public DynJSConfig(ClassLoader parentClassLoader) {
        super(parentClassLoader == null ? new DynamicClassLoader() : parentClassLoader);
        setCompileMode(CompileMode.OFF);
    }

    public void setClustered(boolean isClustered) {
        this.isClustered = isClustered;
    }

    public boolean isClustered() {
        return this.isClustered;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getHost() {
        return this.host;
    }

}
