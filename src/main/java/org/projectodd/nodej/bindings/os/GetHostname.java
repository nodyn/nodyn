package org.projectodd.nodej.bindings.os;

import java.net.UnknownHostException;

import org.dynjs.runtime.ExecutionContext;
import org.dynjs.runtime.GlobalObject;

public class GetHostname extends OsFunctionBinding {
    public GetHostname(GlobalObject globalObject) {
        super(globalObject);
    }

    @Override
    public Object call(ExecutionContext context, Object self, Object... args) {
        try {
            return java.net.InetAddress.getLocalHost().getHostName();
        } catch (UnknownHostException e) {
            return "unknown host";
        }
    }
}