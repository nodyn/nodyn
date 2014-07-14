package io.nodyn.http.server;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.*;
import io.nodyn.EventSource;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;

/**
 * @author Bob McWhirter
 */
public class ServerResponseWrap extends EventSource {

    private static final SimpleDateFormat HTTP_DATE;

    static {
        HTTP_DATE = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
        HTTP_DATE.setTimeZone(TimeZone.getTimeZone("GMT"));
    }

    private int statusCode = 200;

    private final Channel channel;
    private boolean headersSent;
    private boolean sendDate = true;
    private boolean chunked = false;

    private final LastHttpContent last;


    private HttpResponse response = new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.valueOf(200));

    public ServerResponseWrap(Channel channel) {
        this.channel = channel;
        this.last = new DefaultLastHttpContent();
    }

    protected Channel channel() {
        return this.channel;
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

    public void setSendDate(boolean sendDate) {
        this.sendDate = sendDate;
    }

    public boolean getSendDate() {
        return this.sendDate;
    }

    public void writeHead(int statusCode, String reasonPhrase) {
        if (this.headersSent) {
            return;
        }
        this.headersSent = true;
        HttpResponseStatus status = null;
        if (reasonPhrase == null) {
            status = HttpResponseStatus.valueOf(statusCode);
        } else {
            status = new HttpResponseStatus(statusCode, reasonPhrase);
        }
        this.response.setStatus(status);
        if (this.response.headers().get(HttpHeaders.Names.CONTENT_LENGTH) == null) {
            this.response.headers().set(HttpHeaders.Names.TRANSFER_ENCODING, "chunked");
            this.chunked = true;
        }
        if (this.sendDate) {
            this.response.headers().set(HttpHeaders.Names.DATE, getServerTime());
        }
        channel().write(response);
    }

    protected String getServerTime() {
        Calendar calendar = Calendar.getInstance();
        return HTTP_DATE.format(calendar.getTime());
    }

    public HttpHeaders getHeaders() {
        return this.response.headers();
    }

    public HttpHeaders getTrailers() {
        return this.last.trailingHeaders();
    }

    public void write(ByteBuf chunk) {
        writeHead(this.statusCode, null);
        DefaultHttpContent content = new DefaultHttpContent(chunk);
        channel().write(content);
    }

    public void end() {
        end(Unpooled.EMPTY_BUFFER);
    }

    public void end(ByteBuf chunk) {
        writeHead(this.statusCode, null);
        write(chunk);
        if (this.chunked && !this.last.trailingHeaders().isEmpty()) {
            channel().write(this.last);
        } else {
            channel().write(DefaultLastHttpContent.EMPTY_LAST_CONTENT);
        }
        channel().flush();
    }

    public void writeContinue() {
        if ( ! this.headersSent ) {
            channel().writeAndFlush( new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.CONTINUE ));
        }
    }

}
