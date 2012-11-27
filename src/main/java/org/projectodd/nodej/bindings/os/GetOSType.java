package org.projectodd.nodej.bindings.os;

import java.util.HashMap;
import java.util.Map;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class GetOSType extends OsFunctionBinding {
    
    private static Map<String, String> names = new HashMap<String, String>();
    static {
        names.put("Mac OS X", "Darwin");
    }
    
    public GetOSType(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        String name = System.getProperty("os.name");
        if (names.get(name) != null) {
            return names.get(name);
        }
        return name;
    }
}