var helper = require('specHelper');
var net = require( "net-x" );

describe( "net.Server", function() {

  it("should have all the correct functions defined", function() {
    expect(typeof net.Server).toBe('function');
    expect(typeof net.Socket).toBe('function');
    expect(typeof net.createServer).toBe('function');
    expect(typeof net.connect).toBe('function');
    expect(typeof net.createConnection).toBe('function');
    helper.testComplete(true);
  });

  it("should fire a 'listening' event", function() {
    server = net.createServer();
    server.listen(8800, function() {
      server.close();
      helper.testComplete(true);
    });
  });

});
