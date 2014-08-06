var helper = require('./specHelper');
var http   = require('http');

describe( "http.Agent", function() {
  it('should exist', function() {
    expect( http.Agent ).not.toBe( undefined );
  });

  it('should have default maxSockets', function() {
    var agent = new http.Agent();
    expect( agent.maxSockets ).toBe( Infinity );
  });

  it("should allow changing of maxSockets", function() {
    var agent = new http.Agent();
    expect( agent.maxSockets ).toBe( Infinity );
    agent.maxSockets = 15;
    expect( agent.maxSockets ).toBe( 15 );
  });
});

describe( "http.globalAgent", function() {
  it('should exist', function() {
    expect( http.globalAgent ).not.toBe( undefined );
    expect( http.globalAgent instanceof http.Agent ).toBe( true );
  });
});


