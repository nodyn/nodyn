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

package io.nodyn.tty;

import io.nodyn.process.NodeProcess;
import io.nodyn.stream.StreamWrap;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * @author Bob McWhirter
 */
public class TTYWrap extends StreamWrap {

    private String ttyConfig;
    private String ttyProps;

    public TTYWrap(NodeProcess process, int fd, boolean readable) throws IOException {
        super(process);
        this.channelFuture = (readable ? ReadStream.create(process, fd, this) : WriteStream.create(process, fd, this));
    }

    public int getColumns() throws IOException, InterruptedException {
        return getTerminalProperty("columns");
    }

    public int getRows() throws IOException, InterruptedException {
        return getTerminalProperty("rows");
    }

    public void setRawMode(boolean mode) {
        if (mode) {
            enableRawMode();
        } else {
            disableRawMode();
        }
    }

    public void enableRawMode() {
        try {
            this.ttyConfig = stty("-g");

            // sanity check
            if ((ttyConfig.length() == 0)
                    || ((!ttyConfig.contains("=")) && (!ttyConfig.contains(":")))) {
                throw new RuntimeException("Unrecognized stty code: " + ttyConfig);
            }


            /*
            if(Config.isCygwin()) {
                stty("-ixon -icanon min 1 intr undef -echo");
            }
            else {
            */
            // set the console to be character-buffered instead of line-buffered
            // -ixon will give access to ctrl-s/ctrl-q
            //intr undef ctrl-c will no longer send the interrupt signal
            //icrnl, translate carriage return to newline (needed when aesh is started in the background)
            //susb undef, ctrl-z will no longer send the stop signal
            stty("-ixon -icanon min 1 intr undef icrnl susp undef");

            // disable character echoing
            stty("-echo");
            /*
            }
            */
        } catch (IOException ioe) {
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void disableRawMode() {
        if (this.ttyConfig != null) {
            try {
                stty(this.ttyConfig);
                ttyConfig = null;
            } catch (InterruptedException e) {
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }


    /**
     * Run stty with arguments on the active terminal
     *
     * @param args arguments
     * @return output
     * @throws java.io.IOException  stream
     * @throws InterruptedException stream
     */
    protected static String stty(final String args) throws IOException, InterruptedException {
        return exec("stty " + args + " < /dev/tty").trim();
    }

    /**
     * Run a command and return the output
     *
     * @param cmd what to execute
     * @return output
     * @throws java.io.IOException  stream
     * @throws InterruptedException stream
     */
    private static String exec(final String cmd) throws IOException, InterruptedException {
        return exec(new String[]{"sh", "-c", cmd});
    }

    /**
     * Run a command and return the output
     *
     * @param cmd the command
     * @return output
     * @throws IOException          stream
     * @throws InterruptedException stream
     */
    private static String exec(final String[] cmd) throws IOException, InterruptedException {
        ByteArrayOutputStream bout = new ByteArrayOutputStream();

        Process p = Runtime.getRuntime().exec(cmd);
        int c;
        InputStream in = null;
        InputStream err = null;
        OutputStream out = null;

        try {
            in = p.getInputStream();

            while ((c = in.read()) != -1) {
                bout.write(c);
            }

            err = p.getErrorStream();

            while ((c = err.read()) != -1) {
                bout.write(c);
            }

            out = p.getOutputStream();

            p.waitFor();
        } finally {
            try {
                if (in != null)
                    in.close();
                if (err != null)
                    err.close();
                if (out != null)
                    out.close();
            } catch (Exception e) {
                // ignore
            }
        }

        return new String(bout.toByteArray());
    }

    private int getTerminalProperty(String prop) throws IOException, InterruptedException {
        // tty properties are cached so we don't have to worry too much about getting term width/height
        if (ttyProps == null) {
            ttyProps = stty("-a");
            //ttyPropsLastFetched = System.currentTimeMillis();
        }
        // need to be able handle both output formats:
        // speed 9600 baud; 24 rows; 140 columns;
        // and:
        // speed 38400 baud; rows = 49; columns = 111;
        for (String str : ttyProps.split(";")) {
            str = str.trim();
            if (str.startsWith(prop)) {
                int index = str.lastIndexOf(" ");

                return Integer.parseInt(str.substring(index).trim());
            } else if (str.endsWith(prop)) {
                int index = str.indexOf(" ");

                return Integer.parseInt(str.substring(0, index).trim());
            }
        }

        return -1;
    }


}
