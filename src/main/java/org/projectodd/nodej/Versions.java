package org.projectodd.nodej;

import org.dynjs.runtime.DynObject;

public class Versions extends DynObject {

	public Object get(String key) {
		return (String) getProperty(key).getAttribute("value");
	}
	
	public void put(String key, String version) {
		setProperty(key, version);
	}

}
