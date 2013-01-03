package org.projectodd.nodej;

import org.dynjs.cli.Repl;


public class Main {
	
	public static void main(String...args) {
        System.setProperty("dynjs.require.path", System.getProperty("user.dir") + "/src/main/javascript");
        System.setProperty("java.library.path", System.getProperty("user.dir") + "/lib");
        Node node = new Node( args );
		node.start();
		Repl repl = new Repl(node.getRuntime(), System.in, System.out, "Nodej charged " + Repl.WELCOME_MESSAGE, "nodej> ");
        repl.run();
	}

}
