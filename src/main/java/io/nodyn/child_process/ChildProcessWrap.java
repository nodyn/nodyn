package io.nodyn.child_process;

import io.nodyn.CallbackResult;
import io.nodyn.EventSource;
import io.nodyn.loop.ManagedEventLoopGroup;
import io.nodyn.loop.RefHandle;
import io.nodyn.stream.InputStreamWrap;

import java.io.IOException;
import java.io.InputStream;

/**
 * @author Bob McWhirter
 */
public class ChildProcessWrap extends EventSource {

    private final ManagedEventLoopGroup managedLoop;
    private final ProcessBuilder builder;
    private Process process;
    private InputStreamWrap stdout;
    private InputStreamWrap stderr;
    private RefHandle handle;

    public ChildProcessWrap(ManagedEventLoopGroup managedLoop, ProcessBuilder builder) {
        this.managedLoop = managedLoop;
        this.builder = builder;
        //this.handle = this.managedLoop.newHandle();
    }

    public void start() throws IOException {
        this.process = this.builder.start();
        setUpWatcher();
    }

    public InputStream getStdout() {
        return this.process.getInputStream();
    }

    public InputStream getStderr() {
        return this.process.getErrorStream();
    }

    protected void setUpWatcher() {
        new Thread() {
            @Override
            public void run() {
                try {
                    int exitVal = ChildProcessWrap.this.process.waitFor();
                    ChildProcessWrap.this.emit("exit", CallbackResult.createSuccess( exitVal ));
                } catch (InterruptedException e) {
                    // ignore and exit thread
                } finally {
                    //ChildProcessWrap.this.handle.unref();
                }
            }
        }.start();

    }
}
