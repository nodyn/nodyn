var isWindows = process.platform === 'win32';
var osBean = java.lang.management.ManagementFactory.getOperatingSystemMXBean();

module.exports = exports = {};

exports.getEndianness = function() {
  return "BE";
};

exports.getHostname = function() {
  return java.net.InetAddress.getLocalHost().getHostName();
};

exports.getLoadAvg = function() {
  if(isWindows) {
	// http://nodejs.org/api/os.html#os_os_loadavg - windows always returns [0, 0, 0]
	return [0, 0, 0];	
  } else {
    avg = java.lang.management.ManagementFactory.getOperatingSystemMXBean().getSystemLoadAverage();
    // node.js likes 1/5/15 minute averages -  we'll just do one 3x
    return [avg, avg, avg];
  }
};

exports.getUptime = function() {
  return java.lang.management.ManagementFactory.getRuntimeMXBean().getUptime();
};

exports.getFreeMem = function() {
  return java.lang.Runtime.getRuntime().freeMemory();
};

exports.getTotalMem = function() {
  return java.lang.Runtime.getRuntime().totalMemory();
};

exports.getCPUs = function() {
  var cores = [];
  var num = java.lang.Runtime.getRuntime().availableProcessors();
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
};

exports.getOSType = function() {
  return osBean.getName();
};

exports.getOSRelease = function() {
  return osBean.getVersion();
};

exports.getInterfaceAddresses = function() {
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
};
