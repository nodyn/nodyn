package io.nodyn.runtime.nashorn;

import io.nodyn.NodeProcess;
import io.nodyn.Nodyn;
import io.nodyn.runtime.Config;
import io.nodyn.runtime.Program;
import org.vertx.java.core.Vertx;

/**
 * @author Lance Ball
 */
public class NashornRuntime extends Nodyn {

    public NashornRuntime(Config config, Vertx vertx, boolean controlLifeCycle) {
        super(config, vertx, controlLifeCycle);
    }

    @Override
    public Object loadBinding(String name) {
        return null;
    }

    @Override
    public Program compile(String source, String fileName, boolean displayErrors) throws Throwable {
        return null;
    }

    @Override
    public void handleThrowable(Throwable t) {

    }

    @Override
    protected NodeProcess initialize() {
        return null;
    }

    @Override
    protected Object runScript(String script) {
        return null;
    }

    @Override
    protected Object getGlobalContext() {
        return null;
    }

}
