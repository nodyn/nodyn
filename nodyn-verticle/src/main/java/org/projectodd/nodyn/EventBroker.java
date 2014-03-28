package org.projectodd.nodyn;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * @author Bob McWhirter
 */
public class EventBroker {

    public void emit(String event, Object... args) {
        if (!this.handlers.containsKey(event)) {
            return;
        }

        for ( EventConsumer each : this.handlers.get( event ) ) {
            each.consume( args );
        }
    }


    public void on(String event, EventConsumer consumer) {
        if (!this.handlers.containsKey(event)) {
            this.handlers.put(event, new HashSet<EventConsumer>());
        }
        this.handlers.get(event).add(consumer);
    }

    private Map<String, Set<EventConsumer>> handlers = new HashMap<>();
}
