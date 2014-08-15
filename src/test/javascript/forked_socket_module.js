
console.log( "*******" );
process.on('connection', function(connection) {
  console.log( "---> " );
  console.log( connection );
  console.log( "<--- " );
  process.exit( 42 );
});

function idle() {
  console.log( "child idle" );
  setTimeout( idle, 1000 );
}

idle();

