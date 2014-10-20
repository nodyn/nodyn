package io.nodyn.extension.spi;

/**
 * @author Bob McWhirter
 */
public interface JSObject {

    Object get(String name);
    void put(String name, Object value);

}
