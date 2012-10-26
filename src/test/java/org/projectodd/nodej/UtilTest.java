package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.Types;
import org.junit.Ignore;
import org.junit.Test;

public class UtilTest extends NodejTestSupport {

    @Test
    public void testRequireUtil() throws IOException {
        assertThat(eval("require('util')").getClass()).isEqualTo(DynObject.class);
    }
    
    @Test
    @Ignore // Pending implementation of String.prototype.replace in dynjs 
    public void testFormat() {
        assertThat(eval("require('util').format('1 2 3')")).isEqualTo("1 2 3");
    }
    
    @Test
    public void testDebug() {
        // Only ensures we don't fail
        assertThat(eval("require('util').debug('message to stderr')")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testError() {
        // Only ensures we don't fail
        assertThat(eval("require('util').error('message to stderr', 'and', {})")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testPuts() {
        // Only ensures we don't fail
        assertThat(eval("require('util').puts('message to stdout', 'and', {})")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testPrint() {
        // Only ensures we don't fail
        assertThat(eval("require('util').print('message to stdout', 'and', {})")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    @Ignore
    public void testLog() {
        // This currently fails when creating the timestamp and calling toString()
        // objects returned from Date#getHours() (or minutes or seconds).
        assertThat(eval("require('util').log('message to log')")).isEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testInspect() {
        // Only ensures we don't fail
        assertThat(eval("var util = require('util');util.inspect(util, true, null)")).isNotEqualTo(Types.UNDEFINED);
    }
    
    @Test
    public void testIsArray() {
        assertThat(eval("require('util').isArray([])")).isEqualTo(true);
        assertThat(eval("require('util').isArray(new Array)")).isEqualTo(true);
        assertThat(eval("require('util').isArray({})")).isEqualTo(false);
    }
    
    @Test
    public void testIsRegExp() {
        assertThat(eval("require('util').isRegExp(/some regexp/)")).isEqualTo(true);
        assertThat(eval("require('util').isRegExp(new RegExp('another regexp'))")).isEqualTo(true);
        assertThat(eval("require('util').isRegExp({})")).isEqualTo(false);
    }

    @Test
    public void testIsDate() {
        assertThat(eval("require('util').isDate(new Date())")).isEqualTo(true);
        assertThat(eval("require('util').isDate(Date())")).isEqualTo(false); // without new, Date() returns a string
        assertThat(eval("require('util').isDate({})")).isEqualTo(false);
    }

    @Test
    public void testIsError() {
        assertThat(eval("require('util').isError(new Error())")).isEqualTo(true);
        assertThat(eval("require('util').isError(new TypeError())")).isEqualTo(true);
        assertThat(eval("require('util').isError({ name: 'Error', message: 'an error occurred' })")).isEqualTo(false);
    }
}
