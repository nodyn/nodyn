package org.projectodd.nodej;

import org.dynjs.runtime.DynFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.DynThreadContext;
import org.dynjs.runtime.java.JavaPrototype;
import org.dynjs.runtime.java.JavaPrototypeFunction;


@JavaPrototype
public class EventEmitter extends DynObject {
	
	public EventEmitter() {
		
	}
	
	@JavaPrototypeFunction
	public void addListener(String event, DynFunction listener) {
	}
	
	@JavaPrototypeFunction
	public void on(Object self, DynThreadContext context, String event, DynFunction listener) {
		System.err.println( "event=" + event );
		System.err.println( "listener=" + listener );
	}
	
	@JavaPrototypeFunction
	public void once(String event, DynFunction listener) {
		
	}
	
	@JavaPrototypeFunction
	public void removeListener(String event, DynFunction listener) {
	}
	
	@JavaPrototypeFunction
	public void removeAllListeners(String event) {
		
	}
	
	@JavaPrototypeFunction
	public void setMaxListeners(int n) {
		
	}
	
	@JavaPrototypeFunction
	public void listeners(String event) {
		
	}
	
	@JavaPrototypeFunction
	public void emit(String event, String...args) {
		
	}

}
