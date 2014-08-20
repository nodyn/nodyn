var helper    = require('./specHelper');
var net       = require('net');

describe('The net module', function() {
  // TODO: This still appears to be racy on CI
  it('should handle pause and resume on a socket', function() {
    helper.testComplete(false);
    waitsFor(helper.testComplete, "The net pause/resume test", 10000);
    var N = 200;
    var recv = '', chars_recved = 0;

    var server = net.createServer(function(connection) {
      function write(j) {
        if (j >= N) {
          connection.end();
          return;
        }
        connection.write('C');
        setTimeout(function() {
          write(j + 1);
        }, 10);
      }
      write(0);
    });

    server.on('listening', function() {
      var client = net.createConnection(8800);
      client.setEncoding('ascii');
      client.on('data', function(d) {
        recv += d;
      });

      setTimeout(function() {
        client.pause();
        chars_recved = recv.length;
        expect(chars_recved).toBeGreaterThan(1);
        setTimeout(function() {
          expect(recv.length).toBe(chars_recved);
          client.resume();

          setTimeout(function() {
            client.pause();
            chars_recved = recv.length;

            setTimeout(function() {
              expect(recv.length).toBe(chars_recved);
              client.resume();

            }, 1000);

          }, 1000);

        }, 1000);

      }, 1000);

      client.on('end', function() {
        server.close();
        client.end();
        helper.testComplete(true);
      });
    });
    server.listen(8800);
  });
});
