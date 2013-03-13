package org.projectodd.nodej;

import java.io.FileNotFoundException;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.vertx.DynJSVerticleFactory;
import org.vertx.java.core.Vertx;
import org.vertx.java.platform.Container;

public class NodeJSVerticleFactory extends DynJSVerticleFactory {
    private Node node;
    
    @Override
    public void init(Vertx vertx, Container container, ClassLoader classloader) {
        super.init(vertx, container, classloader);
        this.node = new Node(getExecutionContext());
        getRuntime().getConfig().setGlobalObjectFactory(new NodeJSGlobalObjectFactory());
        try {
            loadScript(getExecutionContext(), "node.js");
        } catch (FileNotFoundException e) {
            System.err.println("Cannot initialize NodeJ");
            e.printStackTrace();
        }
    }

    private class NodeJSGlobalObjectFactory extends DynJSGlobalObjectFactory {
        @Override
        public GlobalObject newGlobalObject(final DynJS runtime) {
            GlobalObject global = super.newGlobalObject(runtime);
            global.defineGlobalProperty("process", node.getProcess());
            global.defineGlobalProperty("Buffer", "foo");
            return global;
        }
    }
    
}
