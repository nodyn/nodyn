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
    }

    @Override
    public Object execute() {
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
