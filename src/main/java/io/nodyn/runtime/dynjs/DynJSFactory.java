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
