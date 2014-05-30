package org.projectodd.nodyn.posix;

import jnr.constants.platform.Errno;
import jnr.posix.POSIXHandler;

import java.io.File;
import java.io.InputStream;
import java.io.PrintStream;

/**
 * Customized handler for jnr-posix.
 */
public class NodePosixHandler implements POSIXHandler {
    @Override
    public void error(Errno errno, String s) {

    }

    @Override
    public void error(Errno errno, String s, String s2) {

    }

    @Override
    public void unimplementedError(String s) {

    }

    @Override
    public void warn(WARNING_ID warning_id, String s, Object... objects) {

    }

    @Override
    public boolean isVerbose() {
        return true;
    }

    @Override
    public File getCurrentWorkingDirectory() {
        return null;
    }

    @Override
    public String[] getEnv() {
        return new String[0];
    }

    @Override
    public InputStream getInputStream() {
        return null;
    }

    @Override
    public PrintStream getOutputStream() {
        return null;
    }

    @Override
    public int getPID() {
        return 0;
    }

    @Override
    public PrintStream getErrorStream() {
        return null;
    }
}
