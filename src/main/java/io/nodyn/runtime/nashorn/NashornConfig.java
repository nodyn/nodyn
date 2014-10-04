package io.nodyn.runtime.nashorn;

import io.nodyn.runtime.Config;

/**
 * @author Lance Ball
 */
public class NashornConfig implements Config {
    @Override
    public Object[] getArgv() {
        return new Object[0];
    }

    @Override
    public void setArgv(Object[] argv) {

    }
}
