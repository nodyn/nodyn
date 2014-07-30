package io.nodyn.process;

import io.nodyn.Nodyn;
import io.nodyn.loop.ManagedEventLoopGroup;
import org.dynjs.runtime.Runner;
import org.vertx.java.core.Vertx;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class Process {


    private final Map<String, Object> bindings = new HashMap<>();

    private final Nodyn nodyn;
    private final String osName;
    private final String osArch;

    public Process(Nodyn nodyn) {
        this(nodyn, System.getProperties());
    }

    public Process(Nodyn nodyn, Properties props) {
        this.nodyn = nodyn;
        this.osName = props.getProperty("os.name").toLowerCase();
        this.osArch = props.getProperty("os.arch").toLowerCase();
    }

    public Nodyn getNodyn() {
        return this.nodyn;
    }

    public ManagedEventLoopGroup getEventLoop() {
        return this.nodyn.getEventLoop();
    }

    public Vertx getVertx() {
        return this.nodyn.getVertx();
    }

    public Object binding(String name) {
        Object binding = this.bindings.get(name);
        if (binding == null) {
            binding = loadBinding(name);
            if (binding != null) {
                this.bindings.put(name, binding);
            }
        }
        return binding;
    }

    protected Object loadBinding(String name) {
        try {
            Runner runner = this.nodyn.newRunner();
            runner.withSource("require('nodyn/" + name + "_binding');");
            return runner.execute();
        } catch (Throwable t) {
            try {
                Runner runner = this.nodyn.newRunner();
                runner.withSource("require('nodyn/bindings/" + name + "');");
                return runner.execute();
            } catch (Throwable t2) {
                t2.printStackTrace();
                return null;
            }
        }
    }

    public String getExecPath() {
        File nodynBinary = new File( System.getProperty( "nodyn.binary" ) );
        nodynBinary = nodynBinary.getAbsoluteFile();
        return nodynBinary.getParentFile().getParent();
    }

    /**
     * http://nodejs.org/api/process.html#process_process_platform 'darwin',
     * 'freebsd', 'linux', 'sunos' or 'win32'
     *
     * @return
     */
    public String platform() {
        if (isLinux()) {
            return "linux";
        } else if (isMac()) {
            return "darwin";
        } else if (isFreeBSD()) {
            return "freebsd";
        } else if (isSunos()) {
            return "sunos";
        } else if (isWindows()) {
            return "win32";
        }
        return null;
    }

    public boolean isLinux() {
        return osName.indexOf("linux") >= 0;
    }

    public boolean isMac() {
        return osName.indexOf("darwin") >= 0 || osName.indexOf("mac") >= 0;
    }

    public boolean isFreeBSD() {
        return osName.indexOf("freebsd") >= 0;
    }

    public boolean isSunos() {
        return osName.indexOf("sunos") >= 0;
    }

    public boolean isWindows() {
        return osName.indexOf("win") >= 0;
    }

    /**
     * http://nodejs.org/api/process.html#process_process_arch 'arm', 'ia32', or
     * 'x64'
     *
     * @return
     */
    public String arch() {
        if (isX64()) {
            return "x64";
        } else if (isIa32()) {
            return "ia32";
        } else if (isArm()) {
            return "arm";
        }
        return null;
    }

    public boolean isIa32() {
        return osArch.indexOf("x86") >= 0 || osArch.indexOf("i386") >= 0;
    }

    public boolean isX64() {
        return osArch.indexOf("amd64") >= 0 || osArch.indexOf("x86_64") >= 0;
    }

    public boolean isArm() {
        return osArch.indexOf("arm") >= 0;
    }

}
