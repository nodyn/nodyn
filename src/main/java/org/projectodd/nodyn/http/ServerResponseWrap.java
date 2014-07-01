package org.projectodd.nodyn.http;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.*;
import org.projectodd.nodyn.EventSource;

import java.util.Map;

/**
 * @author Bob McWhirter
 */
public class ServerResponseWrap extends EventSource {

    private int statusCode = 200;

    private final Channel channel;
    private boolean headersSent;

    private HttpResponse response = new DefaultHttpResponse( HttpVersion.HTTP_1_1, HttpResponseStatus.valueOf( 200 ) );

    public ServerResponseWrap(Channel channel) {
        this.channel = channel;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return this.statusCode;
    }

    public boolean getHeadersSent() {
        return this.headersSent;
    }

    public void writeHead(int statusCode, String reasonPhrase, Map<String,String> headers) {
        if ( this.headersSent) {
            return;
        }
        this.headersSent = true;
        HttpResponseStatus status = null;
        if ( reasonPhrase == null ) {
            status = HttpResponseStatus.valueOf( statusCode );
        } else {
            status = new HttpResponseStatus( statusCode, reasonPhrase );
        }
        this.response.setStatus( status );
        if ( this.response.headers().get(HttpHeaders.Names.CONTENT_LENGTH) == null ) {
            this.response.headers().set( HttpHeaders.Names.TRANSFER_ENCODING, "chunked" );
        }
        this.channel.write( response );
    }

    public void setHeader(String name, Object value) {
        if ( value instanceof String[] ) {
            this.response.headers().remove(name);
            int len = ((String[]) value).length;
            for ( int i = 0 ; i < len ; ++i ) {
                this.response.headers().add(name, ((String[]) value)[i].toString());
            }
        } else {
            this.response.headers().set(name, value.toString());
        }
    }

    public Object getHeader(String name) {
        return this.response.headers().get(name);
    }

    public void removeHeader(String name) {
        this.response.headers().remove(name);
    }

    public void _write(ByteBuf chunk) {
        writeHead(this.statusCode, null, null);
        DefaultHttpContent content = new DefaultHttpContent(chunk);
        this.channel.write( content );
    }

    public void end() {
        end( Unpooled.EMPTY_BUFFER );
    }

    public void end(ByteBuf chunk) {
        DefaultLastHttpContent last = new DefaultLastHttpContent(chunk);
        this.channel.write( last );
        this.channel.flush();
    }
}
