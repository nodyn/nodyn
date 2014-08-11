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

import io.netty.buffer.ByteBuf;

import java.io.IOException;

/**
 * @author Bob McWhirter
 */
public class SyncProcessWrap {

    private Process subProcess;
    private OutputConsumer stdOutConsumer;
    private OutputConsumer stdErrConsumer;

    public SyncProcessWrap() {
    }

    public int getPid() throws NoSuchFieldException, IllegalAccessException {
        return UnsafeProcess.getPid( this.subProcess );
    }

    public int spawn(String file, String...args) throws IOException, InterruptedException {
        ProcessBuilder builder = new ProcessBuilder( args );
        this.subProcess = builder.start();

        this.stdOutConsumer = new OutputConsumer( this.subProcess.getInputStream() );
        this.stdErrConsumer = new OutputConsumer( this.subProcess.getErrorStream() );

        new Thread( this.stdOutConsumer ).start();
        new Thread( this.stdErrConsumer ).start();

        return this.subProcess.waitFor();
    }

    public ByteBuf getStdout() {
        return this.stdOutConsumer.getBuffer();
    }

    public ByteBuf getStderr() {
        return this.stdErrConsumer.getBuffer();
    }

}
