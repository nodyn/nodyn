var helper = require('./specHelper');
var cluster = require('cluster');
var http = require('http');

describe("clustering", function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  it ('should be able to delegate requests to children', function() {
      waitsFor(helper.testComplete, "child to come online process a request and die", 5000);
      cluster.setupMaster( {
        exec: './src/test/javascript/cluster_child.js',
        silent: false
      } );
      var child = cluster.fork();
      expect( cluster.workers[1] ).toBe( child );
      var body = '';
      child.on('listening', function() {
        //console.log( "child listening" );
        http.get( { port: 8000 }, function(response) {
          response.on('data', function(d) {
            body += d.toString();
          });
          response.on('end', function() {
            expect( body ).toContain( child.process.pid );
            expect( body ).toContain( "worker#1" );
            //console.log( "disconnecting" );
            child.on( 'disconnect', function() {
              child.kill();
            });
            child.on('exit', function() {
              helper.testComplete(true);
            })
            child.disconnect();
          });
        } );
      })
      child.on( 'online', function() {
        //console.log( "child is online" );
      })
  });


});
