package org.projectodd.nodyn.net;

/**
 * @author Bob McWhirter
 */
public interface EventBroker {
    void emit(String event, Object...args);
}
