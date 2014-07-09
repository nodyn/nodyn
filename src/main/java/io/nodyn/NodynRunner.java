package io.nodyn;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.Runner;
import org.vertx.java.core.Context;
import org.vertx.java.core.Handler;

/**
 * @author lanceball
 */
public class NodynRunner extends Runner {

    private final Context loopContext;

    NodynRunner(ExecutionContext context, Context loopContext) {
        super(context);
        this.loopContext = loopContext;
        System.err.println("GOT CONTEXT " + loopContext);
    }

    @Override
    public Object execute() {
        System.err.println("EXEC CONTEXT " + loopContext);
        loopContext.runOnContext(new Handler<Void>() {
            @Override
            public void handle(Void aVoid) {
                superExec();
            }
        });
        return null;
    }

    @Override
    public Object evaluate() {
        System.err.println("EVAL CONTEXT " + loopContext);
        loopContext.runOnContext(new Handler<Void>() {
            @Override
            public void handle(Void aVoid) {
                superEval();
            }
        });
        return null;
    }

    private Object superEval() {
        return super.evaluate();
    }

    private Object superExec() {
        return super.execute();
    }

}
