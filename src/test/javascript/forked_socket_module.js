
console.log( "*******" );
process.on('message', function(m, connection) {
  console.log( "---> " );
  console.log( "---> " );
  console.log( "---> " );
  console.log( "---> " );
  console.log( "---> " );
  console.log( connection );
  console.log( "<--- " );
  console.log( "<--- " );
  console.log( "<--- " );
  console.log( "<--- " );
  console.log( "<--- " );
  process.exit( 42 );
});

function idle() {
  console.log( "child idle" );
  setTimeout( idle, 1000 );
}

idle();

