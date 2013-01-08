package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Ignore;
import org.junit.Test;

public class UrlTest extends NodejTestSupport {

    @Test
    public void UrlParse() {
        eval("var url = require('url')");
        eval("var obj = url.parse('http://user:pass@www.foo.com:8080/some/path?with=querystring&another=value#hash')");
        assertThat(eval("obj.protocol")).isEqualTo("http:");
        assertThat(eval("obj.href")).isEqualTo("http://user:pass@www.foo.com:8080/some/path?with=querystring&another=value#hash");
        assertThat(eval("obj.host")).isEqualTo("www.foo.com:8080");
        assertThat(eval("obj.auth")).isEqualTo("user:pass");
        assertThat(eval("obj.hostname")).isEqualTo("www.foo.com");
        assertThat(eval("obj.port")).isEqualTo("8080");
        assertThat(eval("obj.pathname")).isEqualTo("/some/path");
        assertThat(eval("obj.search")).isEqualTo("?with=querystring&another=value");
        assertThat(eval("obj.path")).isEqualTo("/some/path?with=querystring&another=value");
        assertThat(eval("obj.hash")).isEqualTo("#hash");
    }
}
