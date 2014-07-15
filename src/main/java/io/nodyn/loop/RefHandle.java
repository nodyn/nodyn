package io.nodyn.loop;

/**
 * @author Bob McWhirter
 */
public class RefHandle {

    private final RefCounted refCounted;
    private boolean counted;

    public RefHandle(RefCounted refCounted) {
        this.refCounted = refCounted;
        ref();
    }

    public RefHandle create() {
        return new RefHandle( this.refCounted );
    }

    public RefHandleHandler handler() {
        return new RefHandleHandler( this );
    }

    public synchronized void ref() {
        if ( this.counted ) {
            return;
        }

        this.counted = true;

        this.refCounted.incrCount();
    }

    public synchronized void unref() {
        if ( ! this.counted ) {
            return;
        }

        this.counted = false;

        this.refCounted.decrCount();
    }


}
