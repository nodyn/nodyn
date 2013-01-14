package org.projectodd.nodej.bindings.net;


public class ServerFactory {

    public static Server createServer() {
        return new ServerFactory.Server();
    }
    
    public static class Server {
        public void listen() {
            
        }
    }
}
    
