var net = require('net');

process.on('message', function(m, connection) {
  var result = '';
  connection.write( "GET / HTTP/1.1\r\nConnection: close\r\n\r\n");
  connection.on( 'data', function(data) {
    result += data.toString();
  });
  connection.on( 'end', function() {
    if ( result.indexOf( 'Set-Cookie' ) >= 0 || result.indexOf( '302 Found' ) ) {
      process.exit( 42 );
    }
    process.exit( -1 );
  });
});

function idle() {
  setTimeout( idle, 1000 );
}

process.send( 'ready' );
idle();

