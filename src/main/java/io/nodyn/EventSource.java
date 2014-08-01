package io.nodyn;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Bob McWhirter
 */
public class EventSource {

    private Map<String, Callback> callbacks = new HashMap<>();

    public EventSource() {

    }

    public Object emit(String event, CallbackResult result) {
        Callback callback = this.callbacks.get(event);
        if (callback != null) {
            return callback.call(result);
        }
        return null;
    }

    public void on(String event, Callback callback) {
        if (callback == null) {
            this.callbacks.remove(event);
        } else {
            this.callbacks.put(event, callback);
        }
    }
}
