package io.nodyn.dns;

import io.nodyn.process.NodeProcess;
import org.vertx.java.core.dns.SrvRecord;

/**
 * @author Bob McWhirter
 */
public class QuerySrvWrap extends AbstractQueryWrap {

    public QuerySrvWrap(NodeProcess process, String name) {
        super(process, name);
    }

    public void start() {
        dnsClient().resolveSRV(name, this.<SrvRecord>listHandler());
    }
}
