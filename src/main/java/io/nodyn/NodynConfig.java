package io.nodyn;

import org.dynjs.runtime.GlobalObjectFactory;

/**
 * @author lanceball
 */
public class NodynConfig extends org.dynjs.Config {

    private boolean isClustered;
    private String host;

    public NodynConfig(ClassLoader parentClassLoader) {
        super(parentClassLoader);
    }

    public NodynConfig() {
        super();
    }

    public void setClustered(boolean isClustered) {
        this.isClustered = isClustered;
    }

    public boolean isClustered() {
        return this.isClustered;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getHost() {
        return this.host;
    }
}
