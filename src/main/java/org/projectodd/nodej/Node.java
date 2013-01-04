package org.projectodd.nodej;

import java.io.File;
import java.io.IOException;

import org.dynjs.Config;
import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.GlobalObjectFactory;

public class Node {

    public static final String VERSION = "0.1.0";
    private String filename = "<eval>";
    private DynJS runtime;
    private String[] args;

    public Node(String... args) {
        this.args = args;
        Config config = new Config();
        config.setGlobalObjectFactory(new GlobalObjectFactory() {
            @Override
            public GlobalObject newGlobalObject(DynJS runtime) {
                final GlobalObject globalObject = new GlobalObject(runtime);
                globalObject.defineGlobalProperty("__filename", getFilename());
                globalObject.defineGlobalProperty("process", new Process(globalObject, Node.this.args));
                return globalObject;
            }
        });
        this.runtime = new DynJS(config);
        this.runtime.evaluate("var console = require('console')");
        this.runtime.evaluate("var Buffer = require('buffer').Buffer");
    }

    public void start() {
        // Start event processing
    }
    
    // I'm not sure if we really want to expose this or not. 
    // At the moment, it's being used for testing
    public DynJS getRuntime() {
        return this.runtime;
    }
    
    public String getFilename() {
        return this.filename;
    }
    
    public void setFilename(String filename) {
        this.filename = filename;
    }

    public void execute(File file) {
        try {
            this.setFilename(file.getCanonicalPath());
            this.runtime.newRunner().withSource(file).execute();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
