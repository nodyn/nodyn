var fs = require('fs');
var request = require('request');

// get today's google doodle
request('https://www.google.com/images/icons/hpcg/ribbon-black_68.png').pipe(fs.createWriteStream('doodle.png'));
