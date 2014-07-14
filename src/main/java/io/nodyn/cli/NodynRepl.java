package io.nodyn.cli;


/**
 *  Copyright 2013 Douglas Campos, and individual contributors
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import io.nodyn.netty.RefHandle;
import org.dynjs.exception.DynJSException;
import org.dynjs.runtime.DynJS;
import org.jboss.aesh.console.*;
import org.jboss.aesh.console.Console;
import org.jboss.aesh.console.helper.InterruptHook;
import org.jboss.aesh.console.settings.QuitHandler;
import org.jboss.aesh.console.settings.Settings;
import org.jboss.aesh.console.settings.SettingsBuilder;
import org.jboss.aesh.edit.actions.Action;

import java.io.*;

public class NodynRepl {

    public static final String WELCOME_MESSAGE = "dynjs console."
            + System.lineSeparator()
            + "Type exit and press ENTER to leave."
            + System.lineSeparator();
    public static final String PROMPT = "dynjs> ";
    private final DynJS runtime;
    private final PrintStream out;
    private final InputStream in;
    private final String welcome;
    private final String prompt;
    private final RefHandle handle;

    private PrintWriter log;

    public NodynRepl(RefHandle handle, DynJS runtime, InputStream in, OutputStream out, String welcome, String prompt, String log) {
        this.handle = handle;
        this.prompt = prompt;
        this.welcome = welcome;
        this.runtime = runtime;
        this.out = new PrintStream(out);
        this.in = in;
        try {
            this.log = new PrintWriter(log);
        } catch (IOException e) {
            System.err.println("Cannot create error log " + log);
        }
    }

    public void run() {
        System.err.println( "Running Nodyn REPL" );
        final Settings consoleSettings = new SettingsBuilder()
                .outputStream(this.out)
                .inputStream(this.in)
                .historySize(100)
                .parseOperators(false)
                .interruptHook( new InterruptHook() {
                    @Override
                    public void handleInterrupt(Console console, Action action) {
                        if ( action == Action.EOF || action == Action.INTERRUPT ) {
                            console.stop();
                            handle.unref();
                        }
                    }
                })
                .quitHandler(new QuitHandler() {
                    @Override
                    public void quit() {
                        handle.unref();
                        if (log != null) {
                            log.close();
                        }
                    }
                }).create();

        final org.jboss.aesh.console.Console console = new org.jboss.aesh.console.Console(consoleSettings);
        console.getShell().out().println(welcome);
        console.setPrompt(new Prompt(prompt));
        console.setConsoleCallback(new AeshConsoleCallback() {
            @Override
            public int execute(ConsoleOperation output) {
                String statement = output.getBuffer();
                log.write(statement + "\n");
                if (statement.equalsIgnoreCase("exit")) {
                    console.stop();
                    handle.unref();
                    return 0;
                } else {
                    try {
                        Object object = runtime.evaluate(statement);
                        log.write(object.toString() + "\n");
                        console.getShell().out().println(object.toString());
                    } catch (DynJSException e) {
                        console.getShell().out().println(e.getLocalizedMessage());
                        logException(e);
                    } catch (IncompatibleClassChangeError e) {
                        console.getShell().err().println("ERROR> " + e.getLocalizedMessage());
                        console.getShell().err().println("Error parsing statement: " + statement);
                        logException(e);
                    } catch (Exception e) {
                        e.printStackTrace(new PrintWriter(out));
                        logException(e);
                    }
                }
                return 0;
            }
        });
        console.start();
    }

    private void logException(Throwable e) {
        log.write(e.getLocalizedMessage() + "\n");
        e.printStackTrace(log);
        log.write("\n");
    }
}

