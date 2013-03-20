load("vertx_tests.js");

var url = require('url');


function testParse() {
  var obj = url.parse('http://user:pass@www.foo.com:8080/some/path?with=querystring&another=value#hash')
  vassert.assertEquals(obj.protocol, "http:");
  vassert.assertEquals(obj.href, "http://user:pass@www.foo.com:8080/some/path?with=querystring&another=value#hash");
  vassert.assertEquals(obj.host, "www.foo.com:8080");
  vassert.assertEquals(obj.auth, "user:pass");
  vassert.assertEquals(obj.hostname, "www.foo.com");
  vassert.assertEquals(obj.port, "8080");
  vassert.assertEquals(obj.pathname, "/some/path");
  vassert.assertEquals(obj.search, "?with=querystring&another=value");
  vassert.assertEquals(obj.path, "/some/path?with=querystring&another=value");
  vassert.assertEquals(obj.hash, "#hash");
  vassert.testComplete();
}

initTests(this);

