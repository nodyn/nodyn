package org.projectodd.nodej.bindings.net;

import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.JSFunction;
import org.dynjs.runtime.PropertyDescriptor;
import org.jboss.netty.bootstrap.ServerBootstrap;
import org.jboss.netty.channel.ChannelFactory;
import org.jboss.netty.channel.socket.nio.NioServerSocketChannelFactory;


public class ServerFactory extends DynObject {

    public ServerFactory(final GlobalObject globalObject) {
        super(globalObject);
        defineOwnProperty(null, "createServer", new PropertyDescriptor() {
            {
                set("Value", new CreateServer(globalObject));
                set("Writable", false);
                set("Configurable", false);
                set("Enumerable", false);
            }
        }, false);

    }

    public static class Server {
        private ServerBootstrap bootstrap;
        
        public Server(ExecutionContext context, JSFunction callback) {
            ChannelFactory factory = new NioServerSocketChannelFactory( Executors.newCachedThreadPool(), Executors.newCachedThreadPool());
            ServerBootstrap bootstrap = new ServerBootstrap(factory);
            bootstrap.setPipelineFactory(new PipelineFactory(context, callback));
        }
        
        public void listen(int port) {
            bootstrap.bind(new InetSocketAddress(port));
        }
    }
    
    public class CreateServer extends AbstractNativeFunction {
        
        public CreateServer(GlobalObject globalObject) {
            super(globalObject, "connectionListener");
        }

        @Override
        public Object call(ExecutionContext context, Object self, Object... args) {
            if (args[0] instanceof JSFunction) {
                return new Server(context, (JSFunction) args[0]);
            }
            return null;
        }
        
    }
}
    
