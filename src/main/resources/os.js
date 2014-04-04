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

var isWindows = process.platform === 'win32';
var util = NativeRequire.require('util');

exports.cpus = function() {
  var cores = [];
  var num = Runtime.getRuntime().availableProcessors();
  for (var i = 0; i < num; i++) {
    var details = {
      model: "unknown",
      speed: 0,
      times: {
        user: 0,
        nice: 0,
        sys: 0,
        idle: 0,
        irq: 0
      }
    };
    cores.push(details)
  }
  return cores;
}

exports.networkInterfaces = function() {
  var interfaces = java.net.NetworkInterface.getNetworkInterfaces();
  var ifs = {};

  while (interfaces.hasMoreElements()) {
    var iface = interfaces.nextElement();
    var addresses = iface.getInetAddresses();
    var addrs = [];

    while (addresses.hasMoreElements()) {
      var addr = addresses.nextElement();
      // A rather crude test for 'IPv6-ness'
      var ipfamily = addr.getHostAddress().indexOf(":") != -1 ? 'IPv6' : 'IPv4';
      var info = {
        address: addr.getHostAddress().toString(),
        family: ipfamily,
        internal: addr.isLoopbackAddress()
      };
      addrs.push(info);
    }

    ifs[iface.getName()] = addrs;
  }

  return ifs;
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
  if(isWindows) {
	// http://nodejs.org/api/os.html#os_os_loadavg - windows always returns [0, 0, 0]
	return [0, 0, 0];	
  } else {
    avg = java.lang.management.ManagementFactory.getOperatingSystemMXBean().getSystemLoadAverage();
    // node.js likes 1/5/15 minute averages -  we'll just do one 3x
    return [avg, avg, avg];
  }
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
  return process.platform;
};

exports.getNetworkInterfaces = util.deprecate(function() {
  return exports.networkInterfaces();
}, 'getNetworkInterfaces is now called `os.networkInterfaces`.');

exports.EOL = isWindows ? '\r\n' : '\n';
