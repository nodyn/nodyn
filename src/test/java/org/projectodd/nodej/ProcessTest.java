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
		assertNull( result );
		
		p.setTitle( "howdy" );
		runtime.eval( context, "var result = process.title" );
		result = context.getScope().resolve( "result" );
		assertEquals( "howdy", result );
	}
	
	public void testVersions() throws Exception {
		DynThreadContext context = new DynThreadContext();
		DynJSConfig config = new DynJSConfig();
		DynJS runtime = new DynJS(config);
		
		Process p = new Process();
		context.getScope().define("process", p);
		runtime.eval( context, "process.versions.http = '1.1'" );
		runtime.eval( context, "var result = process.versions" );
		Versions versions = (Versions) context.getScope().resolve("versions");
				
		assertNotNull( versions );
		
		Versions versions2 = (Versions) context.getScope().resolve("versions");
		
		assertSame( versions, versions );
		
		assertEquals( "1.1", versions.get( "http" ) );
		assertEquals( "1.1", p.getVersions().get( "http" ) );
		
		runtime.eval( context, "process.versions.http = '1.2'" );
		runtime.eval( context, "var result = process.versions.http" );
		
		String httpVersion = (String) context.getScope().resolve( "result" );
		
		assertEquals( "1.2", httpVersion );
		
		assertEquals( "1.2", versions.get( "http" ) );
		assertEquals( "1.2", p.getVersions().get( "http" ) );
	}

}
