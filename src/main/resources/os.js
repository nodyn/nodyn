// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var binding = process.binding('os');
var util = require('util');

exports.cpus = function() {
  // TODO
  return "NOT IMPLEMENTED";
}

exports.networkInterfaces = function() {
  // TODO
  return "NOT IMPLEMENTED";
}

exports.tmpdir = exports.tmpDir = function() {
  return java.lang.System.getProperty("java.io.tmpdir");
}

exports.endianness = function() {
  return "BE";
}

exports.hostname = function() {
  return java.net.InetAddress.getLocalHost().getHostName();
}

exports.uptime = function() {
  return java.lang.management.ManagementFactory.getRuntimeMXBean().getUptime();
}

exports.loadavg = function() {
  avg = java.lang.management.ManagementFactory.getOperatingSystemMXBean().getSystemLoadAverage();
  // node.js likes 1/5/15 minute averages -  we'll just do one 3x
  return [avg, avg, avg];
}

exports.totalmem = function() {
  return java.lang.Runtime.getRuntime().totalMemory();
}

exports.freemem = function() {
  return java.lang.Runtime.getRuntime().freeMemory();
}

exports.type = function() {
  return java.lang.management.ManagementFactory.getOperatingSystemMXBean().getName();
}

exports.release = function() {
  return java.lang.management.ManagementFactory.getOperatingSystemMXBean().getVersion();
}

exports.arch = function() {
  return process.arch;
};

exports.platform = function() {
  return "java";
};

exports.getNetworkInterfaces = util.deprecate(function() {
  return exports.networkInterfaces();
}, 'getNetworkInterfaces is now called `os.networkInterfaces`.');

exports.EOL = process.platform === 'win32' ? '\r\n' : '\n';
