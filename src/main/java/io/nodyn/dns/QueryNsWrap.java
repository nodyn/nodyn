package io.nodyn.dns;

import io.nodyn.process.NodeProcess;

/**
 * @author Bob McWhirter
 */
public class QueryNsWrap extends AbstractQueryWrap {

    public QueryNsWrap(NodeProcess process, String name) {
        super(process, name);
    }

    public void start() {
        dnsClient().resolveNS( this.name, this.<String>listHandler());
    }
}
