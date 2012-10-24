package org.projectodd.nodej;

import java.util.ArrayList;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.PropertyDescriptor;

/**
 * A <code>Process</code> is a node.js application.
 * 
 * @author Bob McWhirter
 * @author Lance Ball
 */
public class Process extends DynObject {

	public Process(GlobalObject globalObject, String[] args) {
	    super(globalObject);
        setProperty(globalObject, "argv", args );
	    setProperty(globalObject, "stdout", globalObject.getConfig().getOutputStream());
        setProperty(globalObject, "stderr", globalObject.getConfig().getErrorStream());
        setProperty(globalObject, "arch", "java" );
        setProperty(globalObject, "platform", "java" );
        setProperty(globalObject, "version", Node.VERSION );

        // These seem to be undocumented in node, but are required?
        setProperty(globalObject, "noDeprecation", false);        
        setProperty(globalObject, "traceDeprecation", false);
        
		setWritableProperty(globalObject, "title", "nodej" );
		
		setProperty(globalObject, "moduleLoadList", new ArrayList<String>() );
		setProperty(globalObject, "versions", new Versions(globalObject) );
		
		setProperty(globalObject, "execArgv", null );
		setProperty(globalObject, "env", null );
		setProperty(globalObject, "pid", null );
		setProperty(globalObject, "features", null );
		setProperty(globalObject, "_eval", null );
		setProperty(globalObject, "_print_eval", null );
		setProperty(globalObject, "_forceRepl", null );
		setProperty(globalObject, "execPath", null );
		setProperty(globalObject, "debugPort", null );
		
		setProperty(globalObject, "_needTickCallback", null );
		setProperty(globalObject, "reallyExit", null );
		setProperty(globalObject, "abort", null );
		setProperty(globalObject, "chdir", null );
		setProperty(globalObject, "cwd", null );
		setProperty(globalObject, "umask", null );
		setProperty(globalObject, "getuid", null );
		setProperty(globalObject, "setuid", null );
		setProperty(globalObject, "getgid", null );
		setProperty(globalObject, "setgid", null );
		setProperty(globalObject, "_kill", null );
		setProperty(globalObject, "_debugProcess", null );
		setProperty(globalObject, "_debugPause", null );
		setProperty(globalObject, "_debugEnd", null );
		setProperty(globalObject, "hrtime", null );
		setProperty(globalObject, "dlopen", null );
		setProperty(globalObject, "uptime", null );
		setProperty(globalObject, "memoryUsage", null );
		//setProperty("uvCounters", null );
		setProperty(globalObject, "binding", null );
	    globalObject.defineGlobalProperty("process", this);
	}
	
    protected void setProperty(final GlobalObject globalObject, String name, final Object value) {
        this.defineOwnProperty(null, name, new PropertyDescriptor() {
            {
                set("Value", value );
                set("Writable", false);
                set("Enumerable", false);
                set("Configurable", false);
            }
        }, false);
    }

    protected void setWritableProperty(final GlobalObject globalObject, String name, final Object value) {
        this.defineOwnProperty(null, name, new PropertyDescriptor() {
            {
                set("Value", value );
                set("Writable", true);
                set("Enumerable", false);
                set("Configurable", false);
            }
        }, false);
    }



}
