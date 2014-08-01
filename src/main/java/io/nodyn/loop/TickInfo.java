package io.nodyn.loop;

import org.dynjs.runtime.JSObject;

/**
 * @author Bob McWhirter
 */
public class TickInfo {

    private final JSObject tickInfo;

    public TickInfo(JSObject tickInfo) {
        this.tickInfo = tickInfo;
    }

    public long getIndex() {
        return (long) this.tickInfo.get( null, "0" );
    }

    public long getLength() {
        return (long) this.tickInfo.get( null, "1" );
    }

}
