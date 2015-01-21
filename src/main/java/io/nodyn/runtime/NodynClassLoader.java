package io.nodyn.runtime;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;

/**
 * @author Bob McWhirter
 */
public class NodynClassLoader extends URLClassLoader {

    public NodynClassLoader(ClassLoader parentClassLoader) {
        super(new URL[0], parentClassLoader);
    }

    public NodynClassLoader() {
        super(new URL[0], NodynClassLoader.class.getClassLoader());
    }

    public Class<?> define(String className, byte[] bytecode) {
        return super.defineClass(className, bytecode, 0, bytecode.length);
    }

    public void append(String path) throws MalformedURLException {
        final URL url = getURL(path);
        addURL(url);
    }
    
    @Override
    public URL findResource(String resource) {
        return getParent().getResource(resource);
    }

    private URL getURL(String target) throws MalformedURLException {
        try {
            // First try assuming a protocol is included
            return new URL(target);
        } catch (MalformedURLException e) {
            // Assume file: protocol
            File f = new File(target);
            String path = target;
            if (f.exists() && f.isDirectory() && !path.endsWith("/")) {
                // URLClassLoader requires that directories end with slashes
                path = path + "/";
            }
            return new URL("file", null, path);
        }
    }
}
