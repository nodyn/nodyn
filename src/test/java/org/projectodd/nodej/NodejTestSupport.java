package org.projectodd.nodej;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.ExecutionContext;
import org.junit.Before;

public class NodejTestSupport {

    protected DynJS runtime;
    protected ExecutionContext context;
    protected String[] defaultArgs = { "node", "somearg" };

    @Before
    public void setUp() {
        System.setProperty("dynjs.require.path", System.getProperty("user.dir") + "/src/main/javascript/node/lib");
        Node node = new Node(defaultArgs);
        runtime = node.getRuntime();
        context = runtime.getExecutionContext();
        node.start();
    }
    
    protected Object eval(String... lines) {
        return getRuntime().evaluate(lines);
    }

    public DynJS getRuntime() {
        return this.runtime;
    }
}