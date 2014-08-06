package io.nodyn.dns;

import io.nodyn.process.NodeProcess;

import java.net.InetAddress;

/**
 * @author Bob McWhirter
 */
public class GetAddrInfoWrap extends AbstractQueryWrap {


    public GetAddrInfoWrap(NodeProcess process, String name) {
        super( process, name );
    }

    @Override
    public void start() {
        dnsClient().lookup(this.name, this.<InetAddress>handler());

    }

}
