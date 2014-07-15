package io.nodyn.netty.pipe;

import java.io.Closeable;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Bob McWhirter
 */
public class CountedCloseable implements Closeable {

    private static Map<Closeable,CountedCloseable> MAP = new HashMap<>();

    public static Closeable get(Closeable delegate) {
        System.err.println( "GET: " + delegate );
        CountedCloseable c = MAP.get(delegate);
        if ( c == null ) {
            c = new CountedCloseable(delegate);
            MAP.put( delegate, c );
        }
        c.incr();
        return c;
    }

    private final Closeable c;
    private int count;

    public CountedCloseable(Closeable c) {
        this.c = c;
    }

    public void incr() {
        ++this.count;
        System.err.println( " *** incr: " + this.c + " " + this.count );
    }

    @Override
    public void close() throws IOException {
        --this.count;
        System.err.println( " *** close: " + this.c + " " + this.count );
        if ( count == 0 ) {
            this.c.close();
            MAP.remove( this.c );
        }

    }
}
