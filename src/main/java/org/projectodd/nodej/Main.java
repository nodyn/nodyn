package org.projectodd.nodej;


public class Main {
	
	public static void main(String...args) {
        System.setProperty("dynjs.require.path", System.getProperty("user.dir") + "/src/main/javascript/node/lib");
        Node node = new Node( args );
		node.start();
	}

}
