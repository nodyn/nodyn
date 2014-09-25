
process.on('message', function(msg) {
  process.exit( msg.exit );
});

process.send( "ready" );

function idle() {
  setTimeout( idle, 1000 ).unref();
}

idle();

