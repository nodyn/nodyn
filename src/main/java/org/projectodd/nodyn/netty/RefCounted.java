package org.projectodd.nodyn.netty;

/**
 * @author Bob McWhirter
 */
public interface RefCounted {

    void incrCount();
    void decrCount();
}
