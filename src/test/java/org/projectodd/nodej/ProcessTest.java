package org.projectodd.nodej;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.DynJSConfig;
import org.dynjs.runtime.DynThreadContext;
import org.junit.Test;

import static org.junit.Assert.*;

public class ProcessTest {
	
	@Test
	public void testTitleSetting() throws Exception {
		DynThreadContext context = new DynThreadContext();
		DynJSConfig config = new DynJSConfig();
		DynJS runtime = new DynJS(config);
		
		Process p = new Process();
		context.getScope().define("process", p);
		runtime.eval( context, "var result = process.title" );
		Object result = context.getScope().resolve( "result" );
		assertEquals( DynThreadContext.UNDEFINED, result );
		
		p.setTitle( "howdy" );
		runtime.eval( context, "var result = process.title" );
		result = context.getScope().resolve( "result" );
		assertEquals( "howdy", result );
	}

}
