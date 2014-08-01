package io.nodyn.dns;

import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.async.AsyncWrap;
import io.nodyn.process.NodeProcess;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * @author Bob McWhirter
 */
public class CaresWrap extends EventSource {

    private final NodeProcess process;

    public CaresWrap(NodeProcess process) {
        this.process = process;
    }

    public void lookup4(final String hostname) {
        new Thread() {
            @Override
            public void run() {
                try {
                    final InetAddress[] result = Inet4Address.getAllByName(hostname);
                    final String[] hostnames = new String[result.length];
                    for ( int i = 0 ; i < result.length ; ++i ) {
                        hostnames[i] = result[i].getHostAddress();
                    }
                    CaresWrap.this.process.getEventLoop().getEventLoopGroup().submit( new Runnable() {
                        @Override
                        public void run() {
                            emit("lookup", CallbackResult.createSuccess( hostnames ) );
                        }
                    });
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
            }
        }.start();

    }
}
