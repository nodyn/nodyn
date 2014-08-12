
console.log( process.env );

function childSpeak() {
  console.log( 'child says hi' );
  setTimeout( childSpeak, 1000 );
}

childSpeak();