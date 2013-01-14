package org.projectodd.nodej;

import java.io.File;
import java.io.PrintStream;
import java.lang.management.ManagementFactory;
import java.util.ArrayList;
import java.util.Map;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.PropertyDescriptor;
import org.projectodd.nodej.bindings.Binding;

/**
 * A <code>Process</code> is a node.js application.
 * 
 * @author Bob McWhirter
 * @author Lance Ball
 */
public class Process extends DynObject {

	public Process(GlobalObject globalObject, String[] args) {
	    super(globalObject);
        setProperty("argv", args );
	    setProperty("stdout", wrappedPrintStream( globalObject, globalObject.getConfig().getOutputStream() ) );
        setProperty("stderr", wrappedPrintStream( globalObject, globalObject.getConfig().getErrorStream() ) );
        setProperty("arch", "java" );
        setProperty("platform", "java" );
        setProperty("version", Node.VERSION );
		setProperty("versions", new Versions(globalObject) );

        // These seem to be undocumented in node, but are required?
        setProperty("noDeprecation", false);        
        setProperty("traceDeprecation", false);
        
		setProperty("moduleLoadList", new ArrayList<String>() );
		
		setProperty("execArgv", null );
		setProperty("env", getProcessEnv(globalObject));
		setProperty("pid", ManagementFactory.getRuntimeMXBean().getName() );
		setProperty("features", null );
		setProperty("_eval", null );
		setProperty("_print_eval", null );
		setProperty("_forceRepl", null );
		setProperty("execPath", new File( args[0]).getAbsolutePath() );
		setProperty("debugPort", null );
		
		setProperty("_needTickCallback", null );
		setProperty("reallyExit", null );
		setProperty("abort", null );
		setProperty("chdir", null );
		setProperty("umask", null );
		setProperty("getuid", null );
		setProperty("setuid", null );
		setProperty("getgid", null );
		setProperty("setgid", null );
		setProperty("_kill", null );
		setProperty("_debugProcess", null );
		setProperty("_debugPause", null );
		setProperty("_debugEnd", null );
		setProperty("hrtime", null );
		setProperty("dlopen", null );
		setProperty("uptime", null );
		setProperty("memoryUsage", null );
		//setProperty("uvCounters", null );
		setProperty("binding", new Binding(globalObject));
        setProperty("cwd", new AbstractNativeFunction(globalObject) {
            @Override
            public Object call(ExecutionContext context, Object self, Object... args) {
                return System.getProperty("user.dir");
            }
        });
	}
	
    private DynObject getProcessEnv(GlobalObject globalObject) {
        DynObject env = new DynObject(globalObject);
        String tmpDir = System.getProperty("java.io.tmpdir");
        if (tmpDir == null) {
            tmpDir = "/tmp";
        }
        Map<String,String> systemEnv = System.getenv();
        for(String key : systemEnv.keySet()) {
            String value = systemEnv.get(key);
            env.put(null, key.replaceAll("[\\./]", "_"), value, false);
        }
        env.put(null, "TMPDIR", tmpDir, false);
        env.put(null, "TMP", tmpDir, false);
        env.put(null, "TEMP", tmpDir, false);
        
        return env;
    }

    protected void setProperty(String name, final Object value) {
        this.defineOwnProperty(null, name, new PropertyDescriptor() {
            {
                set("Value", value );
                set("Writable", false);
                set("Enumerable", false);
                set("Configurable", false);
            }
        }, false);
    }

    protected DynObject wrappedPrintStream(final GlobalObject globalObject, final PrintStream printStream) {
        DynObject object = new DynObject(globalObject);
        object.defineOwnProperty(null, "write", new PropertyDescriptor() {
            {
                set("Value", new AbstractNativeFunction(globalObject) {

                    @Override
                    public Object call(ExecutionContext context, Object self, Object... args) {
                        for (Object arg : args) {
                            printStream.print(arg.toString());
                        }
                        return null;
                    }
                    
                });
                set("Writable", false);
                set("Enumerable", false);
                set("Configurable", false);
            }
        }, false);
        return object;
    }
}
