package org.projectodd.nodyn.net.netty;

import io.netty.channel.ChannelDuplexHandler;
import org.projectodd.nodyn.EventBroker;

/**
 * @author Bob McWhirter
 */
public class EventEmittingHandler extends ChannelDuplexHandler {

    private final EventBroker broker;

    public EventEmittingHandler(EventBroker broker) {
        this.broker = broker;
    }

    void emit(String event, Object...args) {
        this.broker.emit( event, args );
    }

}
