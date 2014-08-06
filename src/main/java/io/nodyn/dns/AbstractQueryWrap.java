package io.nodyn.dns;

import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.process.NodeProcess;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.dns.DnsClient;
import org.vertx.java.core.dns.MxRecord;

import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetSocketAddress;
import java.util.List;

/**
 * @author Bob McWhirter
 */
public abstract class AbstractQueryWrap extends EventSource {

    private final NodeProcess process;
    protected final String name;

    public static int port() {
        if (System.getProperty("dns.port") != null) {
            try {
                return Integer.parseInt(System.getProperty("dns.port"));
            } catch (NumberFormatException e) {
            }
        }

        return 53;
    }

    public AbstractQueryWrap(NodeProcess process, String name) {
        this.process = process;
        this.name = name;
    }

    public abstract void start();

    protected DnsClient dnsClient() {
        return this.process.getVertx().createDnsClient(getServerAddresses());
    }

    protected InetSocketAddress[] getServerAddresses() {
        String[] serverNames = ResolverConfig.getCurrentConfig().servers();
        InetSocketAddress[] servers = new InetSocketAddress[serverNames.length];

        for (int i = 0; i < serverNames.length; ++i) {
            servers[i] = new InetSocketAddress(serverNames[i], port());
        }

        return servers;
    }

    protected <T> Handler<AsyncResult<List<T>>> listHandler() {
        return new AsyncResultHandler<List<T>>() {
            @Override
            public void handle(AsyncResult<List<T>> event) {
                if (event.failed()) {
                    emit("complete", CallbackResult.createError(event.cause()));
                } else {
                    emit("complete", CallbackResult.createSuccess(event.result()));
                }
            }
        };
    }

    protected <T> Handler<AsyncResult<T>> handler() {
        return new AsyncResultHandler<T>() {
            @Override
            public void handle(AsyncResult<T> event) {
                if (event.failed()) {
                    emit("complete", CallbackResult.createError(event.cause()));
                } else {
                    emit("complete", CallbackResult.createSuccess(event.result()));
                }
            }
        };
    }
}
