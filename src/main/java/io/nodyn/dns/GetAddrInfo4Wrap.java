package io.nodyn.dns;

import io.nodyn.NodeProcess;

import java.net.Inet4Address;

/**
 * @author Bob McWhirter
 */
public class GetAddrInfo4Wrap extends AbstractQueryWrap {


    public GetAddrInfo4Wrap(NodeProcess process, String name) {
        super( process, name );
    }

    @Override
    public void start() {
        dnsClient().lookup4(this.name, this.<Inet4Address>handler());
    }

}
