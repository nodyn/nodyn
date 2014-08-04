package io.nodyn.dns;

import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.process.NodeProcess;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.Handler;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;

/**
 * @author Bob McWhirter
 */
public class CaresWrap extends EventSource {

    private final NodeProcess process;

    public CaresWrap(NodeProcess process) {
        this.process = process;
    }

    public void lookup4(final String hostname) {
        // TODO: don't keep creating clients
        process.getVertx().createDnsClient(getServerAddresses()).lookup4(hostname, new Handler<AsyncResult<Inet4Address>>() {
            @Override
            public void handle(AsyncResult<Inet4Address> event) {
                emit("lookup", CallbackResult.createSuccess(event.result()) );
            }
        });
    }

    protected InetSocketAddress[] getServerAddresses() {
        String[] serverNames = ResolverConfig.getCurrentConfig().servers();
        InetSocketAddress[] servers = new InetSocketAddress[serverNames.length];

        for (int i = 0; i < serverNames.length; ++i) {

            servers[i] = new InetSocketAddress(serverNames[i], 53);
        }

        return servers;
    }
}
