package io.nodyn.dns;

import io.nodyn.NodeProcess;

import java.net.Inet6Address;

/**
 * @author Bob McWhirter
 */
public class GetAddrInfo6Wrap extends AbstractQueryWrap {


    public GetAddrInfo6Wrap(NodeProcess process, String name) {
        super( process, name );
    }

    @Override
    public void start() {
        dnsClient().lookup6(this.name, this.<Inet6Address>handler());
    }

}
