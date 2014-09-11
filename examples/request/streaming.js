var fs = require('fs');
var request = require('request');

// get today's google doodle
request('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'));
