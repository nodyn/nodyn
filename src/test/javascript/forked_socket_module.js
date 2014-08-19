
process.on('message', function(m, connection) {
  process.exit( 42 );
});

function idle() {
  setTimeout( idle, 1000 );
}

idle();

