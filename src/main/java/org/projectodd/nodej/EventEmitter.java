package org.projectodd.nodej;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import org.dynjs.runtime.DynFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.DynThreadContext;
import org.dynjs.runtime.java.JavaEmbedUtils;
import org.dynjs.runtime.java.JavaPrototype;
import org.dynjs.runtime.java.JavaPrototypeFunction;

@JavaPrototype
public class EventEmitter extends DynObject {

    public EventEmitter() {

    }

    @JavaPrototypeFunction
    public void addListener(Object self, DynThreadContext context, String event, DynObject listener) {
        addListener( event, listener, false );
    }

    private void addListener(String event, DynObject listener, boolean once) {
        List<ListenerHolder> current = this.listeners.get( event );

        if (current == null) {
            current = new ArrayList<ListenerHolder>();
            this.listeners.put( event, current );
        }

        current.add( new ListenerHolder( listener, once ) );
    }

    @JavaPrototypeFunction
    public void on(Object self, DynThreadContext context, String event, DynObject listener) {
        addListener( event, listener, true );
    }

    @JavaPrototypeFunction
    public void once(Object self, DynThreadContext context, String event, DynFunction listener) {
        addListener( event, listener, true );
    }

    @JavaPrototypeFunction
    public void removeListener(Object self, DynThreadContext context, String event, DynObject listener) {
        List<ListenerHolder> current = this.listeners.get( event );

        if (current == null) {
            return;
        }

        current.remove( listener );
    }

    @JavaPrototypeFunction
    public void removeAllListeners(Object self, DynThreadContext context, String event) {
        if (event == null) {
            listeners.clear();
        } else {
            listeners.remove( event );
        }
    }

    @JavaPrototypeFunction
    public void setMaxListeners(Object self, DynThreadContext context, int n) {

    }

    @JavaPrototypeFunction
    public void listeners(Object self, DynThreadContext context, String event) {
        this.listeners.get( event );
    }

    @JavaPrototypeFunction
    public void emit(Object self, DynThreadContext context, String event, String... args) {
        List<ListenerHolder> current = this.listeners.get( event );

        ListIterator<ListenerHolder> iter = current.listIterator();

        while (iter.hasNext()) {
            ListenerHolder each = iter.next();
            
            System.err.println( "emitting with " + event + "  // " + args );

            JavaEmbedUtils.invoke( each.listener, context, (Object[]) args );

            if (each.once) {
                iter.remove();
            }
        }

    }

    private Map<String, List<ListenerHolder>> listeners = new HashMap<String, List<ListenerHolder>>();

    private static final class ListenerHolder {

        public ListenerHolder(DynObject listener, boolean once) {
            this.listener = listener;
            this.once = once;
        }

        public DynObject listener;
        public boolean once;
    }

}
