package org.projectodd.nodej;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.ExecutionContext;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;

public class NodejTestSupport {

    protected static Node node;
    protected static DynJS runtime;
    protected static ExecutionContext context;
    protected static String[] defaultArgs = { "node", "somearg" };
    
    @BeforeClass
    public static void initialize() {
        System.setProperty("dynjs.require.path", System.getProperty("user.dir") + "/src/main/javascript");
        System.setProperty("java.library.path", System.getProperty("user.dir") + "/lib");
        node = new Node(defaultArgs);
        node.start();
    }

    @Before
    public void setUp() {
        runtime = node.getRuntime();
        context = runtime.getExecutionContext();
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