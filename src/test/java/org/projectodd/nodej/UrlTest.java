package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Ignore;
import org.junit.Test;

public class UrlTest extends NodejTestSupport {

    @Test
    @Ignore
    public void UrlParse() {
        eval("var url = require('url')");
        eval("var obj = util.parse('http://www.foo.com')");
        assertThat(eval("obj.protocol")).isEqualTo("http:");
    }
}
