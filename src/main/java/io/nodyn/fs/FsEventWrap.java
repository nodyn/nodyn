package io.nodyn.fs;

import io.nodyn.NodeProcess;
import io.nodyn.handle.HandleWrap;

/**
 * @author Lance Ball
 */
public class FsEventWrap extends HandleWrap implements Runnable {

    public FsEventWrap(NodeProcess process) {
        super(process, true);
    }

    @Override
    public void run() {

    }
}
