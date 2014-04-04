var helper    = require('specHelper');
var net       = require('net');


describe('The net module', function() {
  // TODO: FIXME
  xit('should handle pause and resume', function() {
    waitsFor(helper.testComplete, "The net pause/resume test", 10);
    var N = 200;
    var recv = '', chars_recved = 0;

    var server = net.createServer(function(connection) {
      function write(j) {
        if (j >= N) {
          connection.end();
          return;
        }
        setTimeout(function() {
          connection.write('C');
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
        chars_recved = recv.length;
        console.log('pause at: ' + chars_recved);
        expect(chars_recved).toBeGreaterThan(1);
        client.pause();
        setTimeout(function() {
          console.log('resume at: ' + chars_recved);
          expect(recv.length).toBe(chars_recved);
          client.resume();

          setTimeout(function() {
            chars_recved = recv.length;
            console.log('pause at: ' + chars_recved);
            client.pause();

            setTimeout(function() {
              console.log('resume at: ' + chars_recved);
              expect(recv.length).toBe(chars_recved);
              client.resume();

            }, 500);

          }, 500);

        }, 500);

      }, 500);

      client.on('end', function() {
        expect(N).toBe(recv.length);
        server.close();
        client.end();
        helper.testComplete(true);
      });
    });
    server.listen(8800);
  });
});

