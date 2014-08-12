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

package io.nodyn.process;

import io.nodyn.NodeProcess;
import io.nodyn.handle.HandleWrap;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;

/**
 * @author Bob McWhirter
 */
public class ProcessWrap extends HandleWrap {

    private final ProcessBuilder builder;
    private Process subProcess;
    private Thread waiter;
    private int signal = -1;

    public ProcessWrap(NodeProcess process) {
        super(process, false);
        this.builder = new ProcessBuilder();
    }

    public int getPid() throws NoSuchFieldException, IllegalAccessException {
        return UnsafeProcess.getPid( this.subProcess );
    }

    public void addEnvPair(String pair) {
        int equalLoc = pair.indexOf( "=" );
        if ( equalLoc < 0 ) {
            return;
        }

        String name = pair.substring( 0, equalLoc ).trim();
        String value = pair.substring( equalLoc + 1 ).trim();
        this.builder.environment().put( name, value );
    }

    public void inheritStdio(int fd) {
        if ( fd == 0 ) {
            this.builder.redirectInput(ProcessBuilder.Redirect.INHERIT);
        } else if ( fd == 1 ) {
            this.builder.redirectOutput(ProcessBuilder.Redirect.INHERIT);
        } else if ( fd == 2 ) {
            this.builder.redirectError(ProcessBuilder.Redirect.INHERIT);
        }
    }

    public void spawn(String file, String...args) throws IOException {
        builder.command( args );
        this.subProcess = builder.start();
        this.waiter = new Thread( new ExitWaiter(this ) );
        this.waiter.start();
    }

    public void kill(int signal) throws NoSuchFieldException, IllegalAccessException {
        int pid = getPid();
        this.signal = signal;
        this.process.getPosix().kill( getPid(), signal );
    }

    int getSignal() {
        return this.signal;
    }

    public OutputStream getStdin() {
        return this.subProcess.getOutputStream();
    }

    public InputStream getStdout() {
        return this.subProcess.getInputStream();
    }

    public InputStream getStderr() {
        return this.subProcess.getErrorStream();
    }

    public int waitFor() throws InterruptedException {
        return this.subProcess.waitFor();
    }
}
