var net       = require('net');
var vertxTest = require('vertx_tests');
var vassert   = vertxTest.vassert;
var console   = require('vertx/console');


vertxTest.startTests( {
  DEFERREDtestNetPauseAndResume: function() {
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
        vassert.assertEquals(true, chars_recved > 1);
        client.pause();
        setTimeout(function() {
          console.log('resume at: ' + chars_recved);
          vassert.assertEquals(chars_recved, recv.length);
          client.resume();

          setTimeout(function() {
            chars_recved = recv.length;
            console.log('pause at: ' + chars_recved);
            client.pause();

            setTimeout(function() {
              console.log('resume at: ' + chars_recved);
              vassert.assertEquals(chars_recved, recv.length);
              client.resume();

            }, 500);

          }, 500);

        }, 500);

      }, 500);

      client.on('end', function() {
        vassert.assertEquals(N, recv.length);
        server.close();
        client.end();
      });
    });
    server.listen(8800);
  }
});
