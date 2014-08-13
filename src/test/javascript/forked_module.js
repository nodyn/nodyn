
process.on('message', function(msg) {
  process.exit( msg.exit );
});

function idle() {
  setTimeout( idle, 1000 ).unref();
}

idle();

