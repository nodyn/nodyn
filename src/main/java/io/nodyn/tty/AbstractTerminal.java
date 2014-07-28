package io.nodyn.tty;

import java.io.InputStream;
import java.io.OutputStream;

/**
 * @author Bob McWhirter
 */
public abstract class AbstractTerminal {

    private final InputStream in;
    private final OutputStream out;

    public AbstractTerminal(InputStream in, OutputStream out) {
        this.in = in;
        this.out = out;
    }

    public InputStream getIn() {
        return this.in;
    }

    public OutputStream getOut() {
        return this.out;
    }


}
