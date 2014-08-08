package io.nodyn.handle;

import io.nodyn.CallbackResult;
import io.nodyn.async.AsyncWrap;
import io.nodyn.loop.RefHandle;
import io.nodyn.NodeProcess;

/**
 * @author Bob McWhirter
 */
public class HandleWrap extends AsyncWrap {

    private final RefHandle handle;

    public HandleWrap(NodeProcess process, boolean count) {
        super( process );
        this.handle = process.getEventLoop().newHandle(count);
    }

    public void close() {
        this.handle.unref();
        emit( "close", CallbackResult.EMPTY_SUCCESS );
    }

    public void ref() {
        this.handle.ref();
    }

    public void unref() {
        this.handle.unref();
    }
}
