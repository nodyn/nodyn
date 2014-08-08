package io.nodyn;

import io.nodyn.process.NodeProcess;
import org.jasmine.cli.JVM;

/**
 * @author Bob McWhirter
 */
public class NodynJVM extends JVM {

    private final NodeProcess process;

    public NodynJVM(NodeProcess process) {
        this.process = process;
    }

    @Override
    public void die() {
        process.setExitCode(1);
    }
}
