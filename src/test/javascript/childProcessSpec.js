
var helper = require('specHelper');
var child_process = require('child_process');

describe( 'child_process', function() {

  beforeEach(function() {
    helper.testComplete(false);
  });

  it('should work', function() {
    waitsFor(helper.testComplete, "child process to read", 5000 );
    var content = '';
    var proc = child_process.spawn('cat', [ 'pom.xml' ]);
    proc.stdout.on('data', function(d) {
      content += d.toString();
    })
    proc.on('close', function() {
      expect( content.indexOf( '<project xmlns' ) ).toBeGreaterThan(0);
      expect( content.indexOf( '</project>' ) ).toBeGreaterThan(0);
      helper.testComplete(true);
    })
  });
});