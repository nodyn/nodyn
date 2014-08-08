package io.nodyn.dns;

import io.nodyn.NodeProcess;
import org.vertx.java.core.dns.MxRecord;

/**
 * @author Bob McWhirter
 */
public class QueryMxWrap extends AbstractQueryWrap {

    public QueryMxWrap(NodeProcess process, String name) {
        super(process, name);
    }

    public void start() {
        dnsClient().resolveMX(this.name, this.<MxRecord>listHandler());
    }
}
