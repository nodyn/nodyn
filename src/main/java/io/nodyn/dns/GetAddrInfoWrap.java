package io.nodyn.dns;

import io.nodyn.CallbackResult;
import io.nodyn.process.NodeProcess;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * @author Bob McWhirter
 */
public class GetAddrInfoWrap extends AbstractQueryWrap {


    public GetAddrInfoWrap(NodeProcess process, String name) {
        super( process, name );
    }

    @Override
    public void start() {
        if ( this.name.equals( "localhost" ) ) {
            try {
                emit("complete", CallbackResult.createSuccess(InetAddress.getLocalHost()));
            } catch (UnknownHostException e) {
                emit("complete", CallbackResult.createError( e ) );
            }
            return;
        }
        dnsClient().lookup(this.name, this.<InetAddress>handler());

    }

}
