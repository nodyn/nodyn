package io.nodyn.dns;

import io.nodyn.CallbackResult;
import io.nodyn.process.NodeProcess;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.UnknownHostException;

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
