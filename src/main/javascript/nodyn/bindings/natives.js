"use strict";

var getSource = io.nodyn.natives.NativesWrap.getSource;

var source = {};

[
  'nodyn',

  'events',
  'util',

  'buffer',
  'nodyn/codec',
  'nodyn/codec/base64',
  'nodyn/codec/hex',
  'nodyn/codec/us_ascii',
  'nodyn/codec/utf8',
  'nodyn/codec/utf16le',

  'tracing',

  'path',
  'module',

  'vm',

  'assert',

  'fs',
  'nodyn/blocking',

  'stream',
  '_stream_readable',
  '_stream_writable',
  '_stream_duplex',
  '_stream_transform',
  '_stream_passthrough',

  'tty',
  'nodyn/streams',

  'repl',
  'readline',
  'console',
  'domain',

  'string_decoder',

  'net',

  'timers',
  '_linklist',

].forEach( function(name) {
  source[name] = getSource(name);
});

source.config = "{}";

module.exports = source;

