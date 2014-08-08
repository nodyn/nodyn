package io.nodyn.dns;

import io.nodyn.NodeProcess;

import java.net.InetAddress;

/**
 * @author Bob McWhirter
 */
public class GetHostByAddrWrap extends AbstractQueryWrap {

    public GetHostByAddrWrap(NodeProcess process, String name) {
        super(process, name);
    }

    public void start() {
        dnsClient().reverseLookup( this.name, this.<InetAddress>handler());
    }
}
