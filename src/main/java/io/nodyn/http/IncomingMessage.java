package io.nodyn.http;

import io.netty.handler.codec.http.HttpHeaders;

/**
 * @author Bob McWhirter
 */
public interface IncomingMessage {

    void setTrailers(HttpHeaders trailers);
}
