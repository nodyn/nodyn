/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.nodyn;

import io.nodyn.fs.UnsafeFs;
import io.nodyn.loop.EventLoop;
import io.nodyn.loop.ImmediateCheckHandle;
import io.nodyn.loop.TickInfo;
import io.nodyn.loop.Ticker;
import io.nodyn.posix.NodePosixHandler;
import jnr.posix.FileStat;
import jnr.posix.POSIX;
import jnr.posix.POSIXFactory;
import org.dynjs.runtime.Runner;
import org.vertx.java.core.Vertx;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class NodeProcess extends EventSource {

    private final Map<String, Object> bindings = new HashMap<>();

    private final Nodyn nodyn;
    private final String osName;
    private final String osArch;
    private final POSIX posix;

    private ImmediateCheckHandle immediateCheckHandle;
    private boolean needImmediateCallback;
    private int exitCode = 0;

    public NodeProcess(Nodyn nodyn) {
        this(nodyn, System.getProperties());
    }

    public NodeProcess(Nodyn nodyn, Properties props) {
        this.nodyn = nodyn;
        this.osName = props.getProperty("os.name").toLowerCase();
        this.osArch = props.getProperty("os.arch").toLowerCase();

        this.immediateCheckHandle = new ImmediateCheckHandle(nodyn.getEventLoop(), new Runnable() {
            @Override
            public void run() {
                emit("checkImmediate", CallbackResult.EMPTY_SUCCESS);
            }
        });

        this.posix = POSIXFactory.getPOSIX(new NodePosixHandler(), true);
    }

    public boolean isatty(int fd) throws NoSuchFieldException, IllegalAccessException {
        return this.posix.isatty(UnsafeFs.createFileDescriptor( fd ) );
    }

    public void setExitCode(int exitCode) {
        this.exitCode = exitCode;
    }

    public void reallyExit() {
        this.nodyn.reallyExit(this.exitCode);
    }

    public int getExitCode() {
        return this.exitCode;
    }

    public void setupNextTick(Object tickInfo, Runnable tickCallback) {
        this.nodyn.getEventLoop().submitUserTask(new Ticker(this, tickCallback, new TickInfo((org.dynjs.runtime.JSObject) tickInfo)));
    }

    public boolean getNeedImmediateCallback() {
        return this.needImmediateCallback;
    }

    public void setNeedImmediateCallback(boolean v) {
        if (this.immediateCheckHandle.isActive() == v) {
            return;
        }
        this.needImmediateCallback = v;
        if (v) {
            this.immediateCheckHandle.start();
        } else {
            this.immediateCheckHandle.stop();
        }
    }

    public Nodyn getNodyn() {
        return this.nodyn;
    }

    public EventLoop getEventLoop() {
        return this.nodyn.getEventLoop();
    }

    public Vertx getVertx() {
        return this.nodyn.getVertx();
    }

    public Object binding(String name) {
        Object binding = this.bindings.get(name);
        if (binding == null) {
            binding = loadBinding(name);
            this.bindings.put(name, binding);
        }
        return binding;
    }

    protected Object loadBinding(String name) {
        Runner runner = this.nodyn.newRunner();
        runner.withSource("__native_require('nodyn/bindings/" + name + "');");
        return runner.execute();
    }

    public String getArgv0() {
        String bin = System.getProperty("nodyn.binary");
        if (bin == null) {
            bin = "nodyn";
        }
        return bin;
    }

    public String getExecPath() {
        String bin = System.getProperty("nodyn.binary");
        if (bin == null) {
            bin = "nodyn";
        }
        File nodynBinary = new File(bin);
        nodynBinary = nodynBinary.getAbsoluteFile();
        String path = nodynBinary.getAbsolutePath();
        return path;
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

    public POSIX getPosix() {
        return this.posix;
    }

}
