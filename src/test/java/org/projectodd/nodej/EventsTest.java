package org.projectodd.nodej;

import static org.fest.assertions.Assertions.assertThat;

import org.dynjs.runtime.JSFunction;
import org.junit.Ignore;
import org.junit.Test;

public class EventsTest extends NodejTestSupport {

    @Test
    public void testRequireEvents() {
        assertThat(eval("require('events').EventEmitter")).isInstanceOf(JSFunction.class);
    }
    
    @Test
    @Ignore
    public void testOnEvent() {
        eval("var x = 0");
        eval("var func = function() { x = x+1 }");
        eval("var events = require('events').EventEmitter");
        eval("events.prototype.on('ding', func)");
        eval("events.prototype.emit('ding')");
        assertThat(eval("x")).isEqualTo(1L);
        eval("events.prototype.emit('ding')");
        assertThat(eval("x")).isEqualTo(2L);
    }
    
    @Test
    public void testOnce() {
        eval("var x = 0");
        eval("var func = function() { x = x+1 }");
        eval("var events = require('events').EventEmitter");
        eval("events.prototype.once('ding', func)");
        eval("events.prototype.emit('ding')");
        assertThat(eval("x")).isEqualTo(1L);
        eval("events.prototype.emit('ding')");
        assertThat(eval("x")).isEqualTo(1L);
    }
    
    @Test
    public void testRemoveListener() {
        eval("var x = 0");
        eval("var func = function() { x = x+1 }");
        eval("var events = require('events').EventEmitter");
        eval("events.prototype.on('ding', func)");
        assertThat(eval("events.prototype.listeners('ding').length")).isEqualTo(1L);
        eval("events.prototype.removeListener('ding', func)");
        assertThat(eval("events.prototype.listeners('ding').length")).isEqualTo(0L);
    }

    @Test
    public void testRemoveAllListeners() {
        eval("var x = 0");
        eval("var func = function() { x = x+1 }");
        eval("var events = require('events').EventEmitter");
        eval("events.prototype.on('ding', func)");
        assertThat(eval("events.prototype.listeners('ding').length")).isEqualTo(1L);
        eval("events.prototype.removeAllListeners('ding')");
        assertThat(eval("events.prototype.listeners('ding').length")).isEqualTo(0L);
    }
}
