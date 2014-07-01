package io.nodyn.netty;

/**
 * @author Bob McWhirter
 */
public interface RefCounted {

    void incrCount();
    void decrCount();
}
