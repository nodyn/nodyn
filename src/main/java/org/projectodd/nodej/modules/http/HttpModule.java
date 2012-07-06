package org.projectodd.nodej.modules.http;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.DynThreadContext;
import org.dynjs.runtime.java.JavaEmbedUtils;
import org.dynjs.runtime.java.JavaPrototypeFactory;
import org.dynjs.runtime.modules.Export;
import org.dynjs.runtime.modules.Module;

@Module(name = "http")
public class HttpModule {
	
	@Export
	public DynObject createServer(Object self, DynThreadContext context, DynObject requestListener) {
		DynObject server = JavaPrototypeFactory.newObject(context, HttpServer.class );
		JavaEmbedUtils.invokeProperty(server, context, "on", "request", requestListener );
		return server;
	}

}
