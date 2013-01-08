package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Ignore;
import org.junit.Test;

public class StringDecoderTest extends NodejTestSupport {

    @Test
    @Ignore
    public void testWrite() {
        eval("var StringDecoder = require('string_decoder').StringDecoder");
        eval("var decoder = new StringDecoder('utf8')");
        eval("var cent = new Buffer([0xC2, 0xA2])");
        assertThat(eval("decoder.write(cent)")).isEqualTo("¢");
    }
}
