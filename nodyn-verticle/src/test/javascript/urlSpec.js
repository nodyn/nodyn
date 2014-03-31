var helper = require('specHelper');
var url    = require('url');


describe('The url module', function() {
  it('should pass testParse', function() {
    var obj = url.parse('http://user:pass@www.foo.com:8080/some/path?with=querystring&another=value#hash');
    expect(obj.protocol).toBe("http:");
    expect(obj.href).toBe("http://user:pass@www.foo.com:8080/some/path?with=querystring&another=value#hash");
    expect(obj.host).toBe("www.foo.com:8080");
    expect(obj.auth).toBe("user:pass");
    expect(obj.hostname).toBe("www.foo.com");
    expect(obj.port).toBe("8080");
    expect(obj.pathname).toBe("/some/path");
    expect(obj.search).toBe("?with=querystring&another=value");
    expect(obj.path).toBe("/some/path?with=querystring&another=value");
    expect(obj.hash).toBe("#hash");
  });
});
