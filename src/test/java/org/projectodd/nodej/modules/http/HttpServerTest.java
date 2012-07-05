package org.projectodd.nodej.modules.http;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.DynJSConfig;
import org.dynjs.runtime.DynThreadContext;
import org.dynjs.runtime.modules.JavaClassModuleProvider;
import org.junit.Before;
import org.junit.Test;


public class HttpServerTest {
	
	private JavaClassModuleProvider javaClassModuleProvider;
	private DynJSConfig config;
	private DynThreadContext context;
	private DynJS dynJS;

	@Before
	public void setUp() {
        javaClassModuleProvider = new JavaClassModuleProvider();
        javaClassModuleProvider.addModule( new HttpModule() );
        config  = new DynJSConfig();
        context = new DynThreadContext();
        context.addLoadPath(System.getProperty("user.dir") + "/src/test/resources/org/dynjs/runtime/builtins/");
        context.addModuleProvider( javaClassModuleProvider );
        dynJS   = new DynJS(config);
		
	}
	
	@Test
	public void testInstantiation() {
		dynJS.eval( this.context,  "var http = require( 'http' ); var result = http.createServer( function(){ return 'yes!' } );" );
        Object result = context.getScope().resolve("result");
        System.err.println( result );
	}
    
    private void check(String scriptlet, Object expected) {
        dynJS.eval(context, scriptlet);
        Object result = context.getScope().resolve("result");
        assertThat(result).isEqualTo(expected);
    }
}
