package io.nodyn.dns;

import io.nodyn.process.NodeProcess;

import java.net.Inet6Address;

/**
 * @author Bob McWhirter
 */
public class QueryAaaaWrap extends AbstractQueryWrap {

    public QueryAaaaWrap(NodeProcess process, String name) {
        super(process, name);
    }

    public void start() {
        dnsClient().resolveAAAA(this.name, this.<Inet6Address>listHandler());
    }
}
