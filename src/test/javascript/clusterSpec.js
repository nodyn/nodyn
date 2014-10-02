var helper = require('./specHelper');
var cluster = require('cluster');
var http = require('http');

describe("clustering", function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  it ('should be able to delegate requests to children', function() {
      waitsFor(helper.testComplete, "child to come online process a request and die", 10000);
      cluster.setupMaster( {
        exec: './src/test/javascript/cluster_child.js',
        silent: false
      } );
      console.log( "master: forking" );
      var child = cluster.fork();
      expect( cluster.workers[1] ).toBe( child );
      var body = '';
      child.on('listening', function() {
        console.log( "master: child is listening" );
        http.get( { port: 8000 }, function(response) {
          response.on('data', function(d) {
            body += d.toString();
          });
          response.on('end', function() {
            expect( body ).toContain( child.process.pid );
            expect( body ).toContain( "worker#1" );
            child.on( 'disconnect', function() {
              console.log( "master: disconnected, killing" );
              child.kill();
            });
            child.on('exit', function() {
              console.log( "master: child exited" );
              helper.testComplete(true);
            });
            console.log( "master: disconnecting" );
            child.disconnect();
          });
        } );
      });
      child.on( 'online', function() {
        console.log( "master: child is online" );
      });
  });


});
