package org.projectodd.nodyn.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

import org.dynjs.runtime.*;
import org.jboss.netty.handler.codec.http.QueryStringDecoder;

public class QueryString extends DynObject {

    public static QueryString newQueryString(GlobalObject global) {
        return new QueryString(global);
    }
    
    public QueryString(GlobalObject globalObject) {
        super(globalObject);
        setProperty(this, "escape", new AbstractNativeFunction(globalObject) {
            @Override
            public Object call(ExecutionContext context, Object self, Object... args) {
                return QueryString.escape(Types.toString(context, args[0]));
            }
        });
        setProperty(this, "unescape", new AbstractNativeFunction(globalObject) {
            @Override
            public Object call(ExecutionContext context, Object self, Object... args) {
                return QueryString.unescape(Types.toString(context, args[0]));
            }
        });
        setProperty(this, "stringify", new AbstractNativeFunction(globalObject) {
            @Override
            public Object call(ExecutionContext context, Object self, Object... args) {
                return QueryString.stringify(context, args);
            }
        });
        setProperty(this, "parse", new AbstractNativeFunction(globalObject) {
            @Override
            public Object call(ExecutionContext context, Object self, Object... args) {
                return QueryString.parse(context, args);
            }
        });
    }

    public static String stringify(ExecutionContext context, Object[] args) {
        if (args[0] instanceof JSObject) {
            JSObject obj = (JSObject) args[0];
            String sep = "&";
            String eq  = "=";
            if (args[1] != Types.UNDEFINED) {
                sep = Types.toString(context, args[1]);
            }
            if (args[2] != Types.UNDEFINED) {
                eq = Types.toString(context, args[2]);
            }
            StringBuffer string = new StringBuffer();
            for(String name : obj.getAllEnumerablePropertyNames().toList()) {
                final String escapedName = QueryString.escape(name);
                final Object value = obj.get(context, name);
                if (value instanceof DynArray) {
                    DynArray array = (DynArray) value;
                    Long length = Types.toInt32(context, array.get(context, "length"));
                    for (int i=0; i < length; ++i) {
                        string.append(escapedName);
                        string.append(eq);
                        string.append(QueryString.escape(Types.toString(context, array.get(context, ""+i))));
                        if (i < length-1) string.append(sep);
                    }
                    string.append(sep);
                } else {
                    string.append(escapedName);
                    string.append(eq);
                    string.append(QueryString.escape(Types.toString(context, value)));
                    string.append(sep);
                }
            }
            // inefficient way to handle the trailing sep
            return string.toString().substring(0, string.length()-1);
        }
        return "";
    }

    public static JSObject parse(ExecutionContext context, Object[] args) {
        DynObject obj = new DynObject(context.getGlobalObject());
        String string = Types.toString(context, args[0]);
        if (args[1] != Types.UNDEFINED) {
            string = string.replace(Types.toString(context, args[1]), "&");
        }
        if (args[2] != Types.UNDEFINED) {
            string = string.replace(Types.toString(context, args[2]), "=");
        }
        QueryStringDecoder decoder = new QueryStringDecoder("?" + string);
        Map<String, List<String>> parameters = decoder.getParameters();
        for(String key : parameters.keySet()) {
            List<String> values = parameters.get(key);
            if (values.size() == 1) {
                obj.put(context, key, values.get(0), false);
            } else {
                DynArray arr = new DynArray(context.getGlobalObject());
                int i = 0;
                for(String v : values) {
                    arr.put(context, ""+i, Types.toString(context, v), false);
                    i++;
                }
                obj.put(context, key, arr, false);
            }
        }
        return obj;
    }

    public static String escape(String querystring) {
        try {
            return URLEncoder.encode(querystring, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return querystring;
        }
    }
    
    public static String unescape(String querystring) {
        try {
            return URLDecoder.decode(querystring, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return querystring;
        }
    }

    public static void setProperty(DynObject __this, String name, final Object value) {
        PropertyDescriptor descriptor = PropertyDescriptor.newAccessorPropertyDescriptor();
        descriptor.setEnumerable(true);
        descriptor.setValue(value);
        __this.defineOwnProperty(null, name, descriptor, false);
    }
}
