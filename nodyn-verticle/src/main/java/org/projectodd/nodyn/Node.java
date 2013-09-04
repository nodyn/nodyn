package org.projectodd.nodyn;


public class Node {

    public static final String VERSION = "0.1.0";
    private String filename = "<eval>";

    public String getDirname() {
        return System.getProperty("user.dir");
    }

    public String getFilename() {
        return this.filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

}
