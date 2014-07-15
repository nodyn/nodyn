package io.nodyn.loop;

/**
 * @author Bob McWhirter
 */
public interface RefCounted {

    void incrCount();
    void decrCount();
}
