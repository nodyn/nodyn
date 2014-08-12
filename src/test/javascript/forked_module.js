
console.log( process.env );

process.on('message', function(msg) {
  console.log( "RECEIVED MESSAGE" );
  console.log( msg );
});

function childSpeak() {
  console.log( 'child says hi' );
  setTimeout( childSpeak, 1000 );
}

console.log( "speak-a" );
childSpeak();
console.log( "speak-b" );

