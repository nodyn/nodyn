package io.nodyn.dns;

import io.nodyn.process.NodeProcess;

/**
 * @author Bob McWhirter
 */
public class QueryTxtWrap extends AbstractQueryWrap {

    public QueryTxtWrap(NodeProcess process, String name) {
        super(process, name);
    }

    public void start() {
        dnsClient().resolveTXT( name, this.<String>listHandler());
    }
}
