package org.projectodd.nodej.bindings.timers;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.JSFunction;

public class Timer extends Thread {
    public static final Map<Long, Timer> TIMERS = Collections.synchronizedMap(new HashMap<Long, Timer>());

    private ExecutionContext context;
    private JSFunction func;
    private int timeout;
    private Object[] args;

    public Timer(JSFunction func, ExecutionContext context, int timeout, Object... args) {
        this.func = func;
        this.args = args;
        this.context = context;
        this.timeout = timeout;
    }

    public void run() {
        TIMERS.put(this.getId(), this);
        try {
            Thread.sleep(timeout);
            context.call(func, null, args);
            TIMERS.remove(this.getId());
        } catch (InterruptedException e) {
        }
    }
}
