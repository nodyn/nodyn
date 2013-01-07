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
    private boolean repeating;

    public Timer(JSFunction func, ExecutionContext context, int timeout, boolean repeating, Object... args) {
        this.func = func;
        this.args = args;
        this.context = context;
        this.timeout = timeout;
        this.repeating = repeating;
    }

    public void run() {
        TIMERS.put(this.getId(), this);
        try {
            do {
                Thread.sleep(timeout);
                context.call(func, null, args);
            } while (repeating);
        } catch (InterruptedException e) {
        } finally {
            TIMERS.remove(this.getId());
        }
    }
}
