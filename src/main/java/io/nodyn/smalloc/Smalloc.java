package io.nodyn.smalloc;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.nodyn.buffer.NettyExternalIndexedData;
import org.dynjs.runtime.JSObject;

/**
 * @author Bob McWhirter
 */
public class Smalloc {

    public static Object alloc(JSObject obj, int size) throws Exception {
        if ( obj.hasExternalIndexedData() ) {
            throw new Exception( "already has external data" );
        }

        ByteBuf b = Unpooled.buffer(size);
        obj.setExternalIndexedData(new NettyExternalIndexedData(b));
        return obj;
    }

    public static Object truncate(JSObject obj, int len) {
        // we really have nothing to do?
        return obj;
    }

    public static Object sliceOnto(JSObject src, JSObject dest, int start, int len) {
        ByteBuf srcBuf = ((NettyExternalIndexedData)src.getExternalIndexedData()).buffer();
        ByteBuf destBuf = srcBuf.slice( start, len );
        destBuf.writerIndex(0);
        dest.setExternalIndexedData(new NettyExternalIndexedData(destBuf));
        return src;
    }
}
