package org.projectodd.nodyn.util;

import io.netty.handler.codec.http.QueryStringDecoder;
import org.dynjs.runtime.DynArray;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QueryString {
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

    public static String stringify(Map<String,Object> map, String sep, String eq) {
        StringBuffer string = new StringBuffer();
        for(String name : map.keySet()) {
            final String escapedName = QueryString.escape(name);
            final Object value = map.get(name);
            // TODO: What to do for Nashorn types?
            if (value instanceof DynArray) {
                DynArray list = (DynArray) value;
                int length = list.size();
                for (int i=0; i < length; ++i) {
                    string.append(escapedName);
                    string.append(eq);
                    string.append(QueryString.escape((String) list.get(i)));
                    if (i < length-1) string.append(sep);
                }
                string.append(sep);
            } else {
                string.append(escapedName);
                string.append(eq);
                string.append(QueryString.escape(value.toString()));
                string.append(sep);
            }
        }
        // inefficient way to handle the trailing sep
        return string.substring(0, string.length() - 1);
    }

    public static Map<String, Object> parse(String str, String sep, String eq) {
        Map<String, Object> obj = new HashMap<>();
        if (sep != "&") str = str.replace(sep, "&");
        if (eq  != "=") str = str.replace(eq, "=");
        QueryStringDecoder decoder = new QueryStringDecoder("?" + str);
        Map<String, List<String>> parameters = decoder.parameters();
        for(String key : parameters.keySet()) {
            List<String> values = parameters.get(key);
            if (values.size() == 1) {
                obj.put(key, values.get(0));
            } else {
                obj.put(key, values.toArray());
            }
        }
        return obj;
    }
}

