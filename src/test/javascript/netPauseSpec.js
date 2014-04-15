var helper    = require('specHelper');
var net       = require('net');

describe('The net module', function() {
  xit('should handle pause and resume on a socket', function() {
    helper.testComplete(false);
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
        client.pause();
        chars_recved = recv.length;
        console.log('1 pause at: ' + chars_recved);
        console.log('Thread id: ' + 
          java.lang.Thread.currentThread().getId());
        expect(chars_recved).toBeGreaterThan(1);
        setTimeout(function() {
          console.log('1 resume at: ' + chars_recved);
          console.log('Thread id: ' + 
            java.lang.Thread.currentThread().getId());
          expect(recv.length).toBe(chars_recved);
          client.resume();

          setTimeout(function() {
            client.pause();
            chars_recved = recv.length;
            console.log('2 pause at: ' + chars_recved);
            console.log('Thread id: ' + 
              java.lang.Thread.currentThread().getId());

            setTimeout(function() {
              console.log('2 resume at: ' + chars_recved);
              console.log('Thread id: ' + 
                java.lang.Thread.currentThread().getId());
              expect(recv.length).toBe(chars_recved);
              client.resume();

            }, 500);

          }, 500);

        }, 500);

      }, 500);

      client.on('end', function() {
        server.close();
        client.end();
        helper.testComplete(true);
      });
    });
    server.listen(8800);
  });
});

