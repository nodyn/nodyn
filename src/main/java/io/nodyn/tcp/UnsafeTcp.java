package io.nodyn.tcp;

import io.netty.channel.socket.SocketChannelConfig;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.nodyn.fs.UnsafeFs;

import java.io.FileDescriptor;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.net.Socket;
import java.nio.channels.SocketChannel;
import java.nio.channels.spi.SelectorProvider;

/**
 * @author Bob McWhirter
 */
public class UnsafeTcp {

    private static class BoundField {

        BoundField(Object object, Field field) {
            this.object = object;
            this.field = field;
        }

        Object get() throws IllegalAccessException {
            return this.field.get( this.object );
        }

        int getInt() throws IllegalAccessException {
            return this.field.getInt( this.object );

        }

        Object object;
        Field field;
    }

    private static BoundField getField(Object obj, String fieldName) {
        return getField(obj, obj.getClass(), fieldName);
    }

    private static BoundField getField(Object obj, Class cls, String fieldName) {
        try {
            Field f = cls.getDeclaredField(fieldName);
            if (f != null) {
                f.setAccessible(true);
                return new BoundField( obj, f );
            }
        } catch (NoSuchFieldException e) {
            // ignore, try superclass
        }
        if (cls.getSuperclass() == null) {
            return null;
        }
        return getField(obj, cls.getSuperclass(), fieldName);
    }

    private static BoundField getDeepField(Object obj, String... fieldNames) {
        Object cur = obj;

        for (int i = 0; i < fieldNames.length - 1; ++i) {
            BoundField f = getField(cur, fieldNames[i]);
            if (f == null) {
                return null;
            }
            try {
                cur = f.get();
            } catch (IllegalAccessException e) {
                return null;
            }

            if (cur == null) {
                return null;
            }
        }

        return getField(cur, fieldNames[fieldNames.length - 1]);
    }

    public static int getFd(NioSocketChannel channel) throws NoSuchFieldException, IllegalAccessException, IOException {

        SocketChannelConfig config = channel.config();

        BoundField f = getField( config, "javaSocket" );
        Socket socket = (Socket) f.get();

        InputStream in = socket.getInputStream();
        f = getDeepField(in, "ch", "fd", "fd");

        if (f == null) {
            return -1;
        }

        return f.getInt();
    }

    public static SocketChannel attach(int fd) throws Exception {
        Class<?> cls = UnsafeTcp.class.getClassLoader().loadClass("sun.nio.ch.SocketChannelImpl");

        Constructor<?> ctor = cls.getDeclaredConstructor(SelectorProvider.class, FileDescriptor.class, boolean.class);

        SelectorProvider provider = SelectorProvider.provider();
        FileDescriptor fileDesc = UnsafeFs.createFileDescriptor( fd );

        ctor.setAccessible(true);
        return (SocketChannel) ctor.newInstance( provider, fileDesc, true );
    }

    private static void dump(Object o) throws IllegalAccessException {
        dump("", o, o.getClass());
    }

    private static void dump(String indent, Object o, Class cls) throws IllegalAccessException {
        System.err.println(indent + ">" + cls.getName());
        Field[] fields = cls.getDeclaredFields();
        for (int i = 0; i < fields.length; ++i) {
            fields[i].setAccessible(true);
            Object v = fields[i].get(o);
            System.err.println(indent + "  - " + fields[i].getName() + " = " + v + (v == null ? "" : " (" + v.getClass().getName() + ")"));
        }

        if (cls.getSuperclass() != null) {
            dump(indent + "  ", o, cls.getSuperclass());
        }
    }
}
