package org.projectodd.nodej;

import org.dynjs.Config;
import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.GlobalObjectFactory;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;

public class NodejTestSupport {

    protected static Node node;
    protected static DynJS runtime;
    protected static Config config;
    protected static ExecutionContext context;
    protected static String[] defaultArgs = { "node", "somearg" };
    
    @BeforeClass
    public static void initialize() {
        System.setProperty("dynjs.require.path", System.getProperty("user.dir") + "/src/main/javascript");
        System.setProperty("java.library.path", System.getProperty("user.dir") + "/lib");
        config = new Config();
        config.setGlobalObjectFactory(new GlobalObjectFactory() {
            @Override
            public GlobalObject newGlobalObject(DynJS runtime) {
                final GlobalObject globalObject = new GlobalObject(runtime);
                globalObject.defineGlobalProperty("__dirname", System.getProperty("user.dir"));
                globalObject.defineGlobalProperty("vertx", new DynObject(globalObject));
                globalObject.defineGlobalProperty("global", globalObject);
                globalObject.defineGlobalProperty("runtime", runtime);
                globalObject.defineGlobalProperty("load", new AbstractNativeFunction(globalObject) {
                    @Override
                    public Object call(ExecutionContext context, Object self, Object... args) {
                        return null;
                    }
                });
                return globalObject;
            }
        });
        runtime = new DynJS(config);
    }

    @Before
    public void setUp() {
//        runtime = node.getRuntime();
//        context = runtime.getExecutionContext();
//        node = new Node(context);
    }
    
    @AfterClass
    public static void cleanUp() {
        eval("vertx.stop()");
    }
    
    protected static Object eval(String... lines) {
        return getRuntime().evaluate(lines);
    }

    public static DynJS getRuntime() {
        return NodejTestSupport.runtime;
    }
}