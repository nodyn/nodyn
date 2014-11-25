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
  'smalloc',
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

  'repl',
  'readline',
  'console',
  'domain',

  'string_decoder',

  'net',
  'tls',
  '_tls_common',
  '_tls_wrap',
  '_tls_legacy',

  'querystring',
  'http',
  'https',
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

  '_debugger',

].forEach( function(name) {
  source[name] = getSource(name);
});

// see node.js startup.processConfig
source.config = "\n{}";

module.exports = source;

