package org.projectodd.nodyn;

import org.dynjs.Config;
import org.dynjs.vertx.DynJSVerticle;
import org.dynjs.vertx.DynJSVerticleFactory;
import org.vertx.java.platform.Verticle;

public class NodeJSVerticleFactory extends DynJSVerticleFactory {
    @Override
    public Verticle createVerticle(String main) throws Exception {
        Config config = new Config(getClassLoader());
        return new DynJSVerticle(new Nodyn(config), main);
    }
}
