package org.projectodd.nodej;

import org.dynjs.runtime.DynJS;
import org.dynjs.runtime.DynJSConfig;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.DynThreadContext;
import org.dynjs.runtime.java.JavaPrototypeFactory;
import org.junit.Before;
import org.junit.Test;

public class EventEmitterTest {
	
    private DynJSConfig config;
    private DynThreadContext context;
    private DynJS dynJS;

    @Before
    public void setUp() {
        config  = new DynJSConfig();
        context = new DynThreadContext();
        dynJS   = new DynJS(config);
        
    }
    
	@Test
	public void testEmittingAnEvent() {
	    DynObject emitter = JavaPrototypeFactory.newObject( context, EventEmitter.class );
	    context.getScope().define( "emitter", emitter );
	    dynJS.eval(  this.context, "var console = require( 'console' ); var f = function(){ console.log( 'spicy!' ) }; emitter.on( 'taco', f ); emitter.emit( 'taco');" );
	}

}
