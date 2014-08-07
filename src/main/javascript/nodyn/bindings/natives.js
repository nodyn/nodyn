/*
 * Copyright 2014 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

  'punycode',
  'os',

  'tty',
  'nodyn/streams',

  'repl',
  'readline',
  'console',
  'domain',

  'string_decoder',

  'net',
  'querystring',
  'http',
  '_http_agent',
  '_http_client',
  '_http_server',
  '_http_incoming',
  '_http_outgoing',
  '_http_common',
  'url',
  'dns',
  'dgram',

  'timers',
  '_linklist',
  'freelist',

  'zlib',

  'cluster',
  'child_process',

  'crypto',
  'constants',

  'nodyn/bindings/crypto',
  'nodyn/bindings/buffer',
  'nodyn/bindings/smalloc',
  'nodyn/bindings/constants',
  'nodyn/bindings/async_wrap',
  'nodyn/bindings/handle_wrap',
  'nodyn/bindings/stream_wrap',
  'nodyn/bindings/timer_wrap',
  'nodyn/bindings/tcp_wrap',
  'nodyn/bindings/pipe_wrap',
  'nodyn/bindings/signal_wrap',
  'nodyn/bindings/tty_wrap',
  'nodyn/bindings/uv',
  'nodyn/bindings/cares_wrap',
  'nodyn/bindings/v8',
  'nodyn/bindings/zlib',
  'nodyn/bindings/http_parser',

].forEach( function(name) {
  source[name] = getSource(name);
});

source.config = "{}";

module.exports = source;

