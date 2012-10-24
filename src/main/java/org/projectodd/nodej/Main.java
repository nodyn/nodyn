package org.projectodd.nodej;

import org.dynjs.runtime.DynJS;

public class Main {
	
	public static void main(String...args) {
	    DynJS dynJS = new DynJS();
		Node node = new Node( args );
		node.start(dynJS.getExecutionContext());
	}

}
