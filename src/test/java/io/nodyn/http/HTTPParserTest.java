package io.nodyn.http;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import org.junit.Test;

import static org.junit.Assert.*;

import java.nio.charset.Charset;


/**
 * @author Bob McWhirter
 */
public class HTTPParserTest {

    public static Charset UTF8 = Charset.forName("utf8");

    @Test
    public void testReadLineNoEOL() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("this is a line without a cr"));
        assertNull(parser.readLine());
    }

    @Test
    public void testReadLineOnlyCR() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("this is a line without a nl\r"));
        assertNull(parser.readLine());
    }

    @Test
    public void testReadLineOneLine() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("this is a line\r\n"));
        ByteBuf line = parser.readLine();
        assertNotNull(line);
        assertEquals("this is a line\r\n", line.toString(UTF8));
        assertEquals(parser.readableBytes(), 0);
    }

    @Test
    public void testReadLineTwoLines() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("this is a line\r\nand so"));
        ByteBuf line = parser.readLine();
        assertNotNull(line);
        assertEquals("this is a line\r\n", line.toString(UTF8));
        line = parser.readLine();
        assertNull(line);
        parser.addBuffer(buffer(" is this\r\n"));
        line = parser.readLine();
        assertEquals("and so is this\r\n", line.toString(UTF8));
        assertEquals(parser.readableBytes(), 0);
    }

    @Test
    public void readRequestLineGet() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("GET / HTTP/1.1\r\n"));
        assertTrue(parser.readRequestLine());
        assertEquals("GET", HTTPParser.METHODS[parser.getMethod()]);
        assertEquals(1, parser.getVersionMajor());
        assertEquals(1, parser.getVersionMinor());
        assertEquals("/", parser.getUrl());
    }

    @Test
    public void readRequestLinePost() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("POST /tacos HTTP/1.1\r\n"));
        assertTrue(parser.readRequestLine());
        assertEquals("POST", HTTPParser.METHODS[parser.getMethod()]);
        assertEquals(1, parser.getVersionMajor());
        assertEquals(1, parser.getVersionMinor());
        assertEquals("/tacos", parser.getUrl());
    }

    @Test
    public void readRequestLinePostNoVersion() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("POST /tacos\r\n"));
        assertTrue(parser.readRequestLine());
        assertEquals("POST", HTTPParser.METHODS[parser.getMethod()]);
        assertEquals(1, parser.getVersionMajor());
        assertEquals(0, parser.getVersionMinor());
        assertEquals("/tacos", parser.getUrl());
    }

    @Test
    public void readRequestInvalidMethod() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("WHAT\r\n"));
        assertFalse(parser.readRequestLine());
        assertEquals(HTTPParser.Error.INVALID_METHOD, parser.getError());
    }

    @Test
    public void readRequestInvalidVersion() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("GET / HTTP/A.B\r\n"));
        assertFalse(parser.readRequestLine());
        assertEquals(HTTPParser.Error.INVALID_VERSION, parser.getError());
    }

    @Test
    public void testReadStatusLine() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("HTTP/1.1 200 OK\r\n"));
        assertTrue(parser.readStatusLine());
        assertEquals(1, parser.getVersionMajor());
        assertEquals(1, parser.getVersionMinor());
        assertEquals(200, parser.getStatusCode());
        assertEquals("OK", parser.getStatusMessage());
    }

    @Test
    public void testReadStatusLineInvalidStatus() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("HTTP/1.1 99 OK\r\n"));
        assertFalse(parser.readStatusLine());
        assertEquals( HTTPParser.Error.INVALID_STATUS, parser.getError() );
    }

    @Test
    public void readHeadersInvalid() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("foo=bar\r\n"));
        assertEquals(-1, parser.readHeaders());
        assertEquals( HTTPParser.Error.INVALID_HEADER_TOKEN, parser.getError() );
    }

    @Test
    public void readHeadersNotComplete() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer( buffer( "foo: bar\r\n" ) );
        assertEquals( 1, parser.readHeaders() );
    }

    @Test
    public void readHeadersComplete() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer( buffer( "foo: bar\r\n\r\n" ) );
        assertEquals(0, parser.readHeaders());

    }

    @Test
    public void readHeadersMultipleInSeveralPasses() {
        HTTPParser parser = new HTTPParser();
        parser.addBuffer(buffer("foo: bar\r\n"));
        assertEquals(1, parser.readHeaders());
        parser.addBuffer(buffer( "baz:" ) );
        assertEquals(1, parser.readHeaders() );
        parser.addBuffer(buffer( "taco\r\n\r\n" ) );
        assertEquals( 0, parser.readHeaders() );

        assertEquals( "foo", parser.getHeaders()[0] );
        assertEquals( "bar", parser.getHeaders()[1] );
        assertEquals( "baz", parser.getHeaders()[2] );
        assertEquals( "taco", parser.getHeaders()[3] );
    }


    protected ByteBuf buffer(String str) {
        return Unpooled.copiedBuffer(str.getBytes(UTF8));
    }
}
