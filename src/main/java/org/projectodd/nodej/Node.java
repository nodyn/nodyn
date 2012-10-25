package org.projectodd.nodej;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class Node {
	
	public static final String VERSION = "0.1.0";
    private String[] args;

	public Node(String...args) {
		this.args = args;
	}
	
	public void start(ExecutionContext executionContext) {
	    GlobalObject globalObject = executionContext.getGlobalObject();
	    globalObject.defineGlobalProperty("process", new Process(globalObject, this.args));
	}
	

}
