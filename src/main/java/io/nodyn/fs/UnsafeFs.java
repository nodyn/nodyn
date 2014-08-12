package io.nodyn.fs;

import java.io.FileDescriptor;
import java.lang.reflect.Field;

/**
 * @author Bob McWhirter
 */
public class UnsafeFs {

    public static FileDescriptor createFileDescriptor(int fd) throws IllegalAccessException, NoSuchFieldException {
        FileDescriptor fileDesc = new FileDescriptor();
        Field f = fileDesc.getClass().getDeclaredField("fd");
        f.setAccessible(true);
        f.setInt(fileDesc, fd );
        return fileDesc;
    }

    public static void dump(FileDescriptor fd) throws NoSuchFieldException, IllegalAccessException {

        Field f = fd.getClass().getDeclaredField("fd");
        f.setAccessible(true);
        System.err.println( "fd: " + f.getInt( fd ) );
        System.err.println( " - valid: " + fd.valid() );

        f = fd.getClass().getDeclaredField( "useCount" );
        f.setAccessible( true );
        System.err.println( " - count: " + f.get( fd ) );

        /*
        f = fd.getClass().getDeclaredField( "parent" );
        f.setAccessible( true );
        System.err.println( " - parent: " + f.get( fd ) );

        f = fd.getClass().getDeclaredField( "otherParents" );
        f.setAccessible( true );
        System.err.println( " - other: " + f.get( fd ) );
*/


    }
}
