package io.nodyn.dns;

import io.nodyn.process.NodeProcess;

/**
 * @author Bob McWhirter
 */
public class QueryCnameWrap extends AbstractQueryWrap {

    public QueryCnameWrap(NodeProcess process, String name) {
        super(process, name);
    }

    public void start() {
        dnsClient().resolveCNAME( this.name, this.<String>listHandler());
    }
}
