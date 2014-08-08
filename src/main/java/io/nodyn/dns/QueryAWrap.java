package io.nodyn.dns;

import io.nodyn.NodeProcess;

import java.net.Inet4Address;

/**
 * @author Bob McWhirter
 */
public class QueryAWrap extends AbstractQueryWrap {

    public QueryAWrap(NodeProcess process, String name) {
        super(process, name);
    }

    public void start() {
        dnsClient().resolveA(this.name, this.<Inet4Address>listHandler());;
    }
}
