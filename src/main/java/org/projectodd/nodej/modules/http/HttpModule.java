package org.projectodd.nodej.modules.http;

import org.dynjs.api.Function;
import org.dynjs.compiler.DynJSCompiler;
import org.dynjs.runtime.DynFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.DynThreadContext;
import org.dynjs.runtime.java.JavaPrototypeFactory;
import org.dynjs.runtime.modules.Export;
import org.dynjs.runtime.modules.Module;

@Module(name = "http")
public class HttpModule {
	
	@Export
	public DynObject createServer(Object self, DynThreadContext context, DynFunction requestListener) {
		System.err.println( "AAA: " + requestListener );
		DynObject server = JavaPrototypeFactory.newObject(context, HttpServer.class );
		System.err.println( "BBB" );
		Function onFunction = (Function) ((DynObject) server.getProperty( "on" ).getAttribute( "value" )).getProperty( "call" ).getAttribute( "value" );
		System.err.println( "CCC" );
		onFunction.call(self, context, requestListener );
		System.err.println( "DDD" );
		return server;
	}

}
