package org.projectodd.nodej.bindings;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class QueryString {
    public String escape(String querystring) throws UnsupportedEncodingException {
        return URLEncoder.encode(querystring, "UTF-8");
    }
}
