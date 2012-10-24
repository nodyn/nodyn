package org.projectodd.nodej;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.PropertyDescriptor;

public class Versions extends DynObject {
    
    public Versions(GlobalObject globalObject) {
        super(globalObject);
    }

	public Object get(ExecutionContext context, String key) {
		return (String) getProperty(context, key);
	}
	
	public void put(ExecutionContext context, String key, final String version) {
        this.defineOwnProperty(null, key, new PropertyDescriptor() {
            {
                set("Value", version );
                set("Writable", false);
                set("Enumerable", false);
                set("Configurable", false);
            }
        }, false);
	}

}
