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
import jnr.posix.POSIX;
import jnr.posix.SpawnFileAction;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * @author Bob McWhirter
 */
public class ProcessWrap extends HandleWrap {

    private int signal = -1;
    private int pid;

    private List<String> envp = new ArrayList<>();

    private List<StdioConfig> stdio = new ArrayList<>();

    public ProcessWrap(NodeProcess process) {
        super(process, false);
    }

    public int getPid() throws NoSuchFieldException, IllegalAccessException {
        return this.pid;
    }

    public void addEnvPair(String pair) {
        this.envp.add(pair);
    }

    private static final class StdioConfig {
        public static enum Type {
            OPEN,
            CLOSE,
        }

        public Type type;
        public int fd;
    }

    public void stdio(String type, int fd) {
        StdioConfig c = new StdioConfig();
        c.type = StdioConfig.Type.valueOf(type.toUpperCase());
        c.fd = fd;
        this.stdio.add(c);
    }

    public void spawn(String file, String... args) throws IOException {
        POSIX posix = this.process.getPosix();

        List<String> argv = new ArrayList<>();
        for (int i = 0; i < args.length; ++i) {
            argv.add(args[i]);
        }

        Collection<SpawnFileAction> fileActions = new ArrayList<>();

        int i = 0;
        for ( StdioConfig each : this.stdio ) {
            switch (each.type) {
                case OPEN:
                    fileActions.add( SpawnFileAction.dup( each.fd, i ) );
                    ++i;
                    break;
                case CLOSE:
                    fileActions.add( SpawnFileAction.close( each.fd ) );
                    break;
            }

        }

        long result = posix.posix_spawnp(args[0], fileActions, argv, this.envp);

        this.pid = (int) result;
        this.process.getEventLoop().submitBlockingTask( new ExitWaiter(this ) );

    }

    public void kill(int signal) throws NoSuchFieldException, IllegalAccessException {
        this.signal = signal;
        this.process.getPosix().kill(this.pid, signal);
    }

    int getSignal() {
        return this.signal;
    }

    public int waitFor() throws InterruptedException {
        int[] status = new int[1];
        int flags = 0;
        int result = this.process.getPosix().waitpid(this.pid, status, flags);
        return ( status[0] & 0xFF00 ) >> 8;
    }
}
