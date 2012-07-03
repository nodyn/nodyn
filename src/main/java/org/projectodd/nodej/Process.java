package org.projectodd.nodej;

import java.util.ArrayList;

import org.dynjs.runtime.DynObject;

/**
 * A <code>Process</code> is a node.js application.
 * 
 * @author Bob McWhirter
 */
public class Process extends DynObject {

	public Process() {
		setProperty("title", null );
		setProperty("version", Node.VERSION );
		setProperty("moduleLoadList", new ArrayList<String>() );
		setProperty("versions", new Versions() );
		setProperty("arch", "java" );
		setProperty("platform", "java" );
		
		setProperty("argv", null );
		setProperty("execArgv", null );
		setProperty("env", null );
		setProperty("pid", null );
		setProperty("features", null );
		setProperty("_eval", null );
		setProperty("_print_eval", null );
		setProperty("_forceRepl", null );
		setProperty("execPath", null );
		setProperty("debugPort", null );
		
		setProperty("_needTickCallback", null );
		setProperty("reallyExit", null );
		setProperty("abort", null );
		setProperty("chdir", null );
		setProperty("cwd", null );
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
		setProperty("binding", null );
		
	}

	public void setTitle(String title) {
		setProperty("title", title );
	}

	public String getTitle() {
		return (String) getProperty("title").getAttribute("value");
	}
	
	public String getVersion() {
		return (String) getProperty("version").getAttribute("value");
	}
	
	@SuppressWarnings("unchecked")
	public ArrayList<String> getModuleLoadList() {
		return (ArrayList<String>) getProperty("moduleLoadList").getAttribute("value");
	}
	
	public Versions getVersions() {
		return (Versions) getProperty("versions").getAttribute("value");
	}

}
