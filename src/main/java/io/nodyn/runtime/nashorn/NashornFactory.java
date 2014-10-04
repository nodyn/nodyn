package io.nodyn.runtime.nashorn;

import io.nodyn.Nodyn;
import io.nodyn.runtime.Config;
import io.nodyn.runtime.RuntimeFactory;

/**
 * @author Lance Ball
 */
public class NashornFactory extends RuntimeFactory {

    protected NashornFactory(ClassLoader parent) {
        super(parent);
    }

    @Override
    public Nodyn newRuntime(Config config) {
        return new NashornRuntime(config, null, true);
    }

    @Override
    public Config newConfiguration() {
        return new NashornConfig();
    }
}
