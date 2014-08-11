package io.nodyn.process;

import io.nodyn.NodeProcess;
import io.nodyn.handle.HandleWrap;
import jnr.constants.platform.Signal;
import jnr.posix.SignalHandler;

/**
 * @author Bob McWhirter
 */
public class SignalWrap extends HandleWrap implements SignalHandler {

    public SignalWrap(NodeProcess process) {
        super(process, true);
    }

    public void start(int signum) {
        Signal signal = Signal.valueOf( signum );
        this.process.getPosix().signal( signal, this );
    }

    @Override
    public void handle(int i) {
        System.err.println( "HANDLE: " + i );
    }
}
