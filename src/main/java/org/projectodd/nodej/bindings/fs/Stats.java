package org.projectodd.nodej.bindings.fs;

import org.dynjs.runtime.AbstractNativeFunction;
import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;
import org.dynjs.runtime.PropertyDescriptor;
import org.projectodd.nodej.bindings.fs.stats.IsDirectory;

// http://nodejs.org/api/fs.html#fs_class_fs_stats
public class Stats extends AbstractNativeFunction {

    public Stats(GlobalObject globalObject) {
        super(globalObject);
        this.setClassName("Stats");
        final DynObject prototype = new DynObject(globalObject);
        prototype.defineReadOnlyProperty(globalObject, "isDirectory", new IsDirectory(globalObject));
        defineOwnProperty(null, "prototype", new PropertyDescriptor() {
            {
                set("Value", prototype);
                set("Writable", false);
                set("Configurable", false);
                set("Enumerable", false);
            }
        }, false);
        setPrototype(prototype);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        return null;
    }
}
