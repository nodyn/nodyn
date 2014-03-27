package org.projectodd.nodyn;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;

/**
 * @author Bob McWhirter
 */
public class EventBroker {

    public void emit(String event, Object... args) {
        if (!this.handlers.containsKey(event)) {
            return;
        }

        for ( Consumer<Object[]> each : this.handlers.get( event ) ) {
            each.accept( args );
        }
    }


    public void on(String event, Consumer<Object[]> handler) {
        if (!this.handlers.containsKey(event)) {
            this.handlers.put(event, new HashSet<Consumer<Object[]>>());
        }
        this.handlers.get(event).add(handler);
    }

    private Map<String, Set<Consumer<Object[]>>> handlers = new HashMap<>();
}
