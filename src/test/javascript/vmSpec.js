
var helper = require('./specHelper');
var vm     = require('vm');

describe('vm functions', function() {
  it('should allow creation of new contexts', function() {
    try {
      var context = vm.createContext();
      expect(context).not.toBe( undefined );
      expect(typeof context).toBe("object");
      expect(context.dynjs.runtime).not.toBe( undefined );
    } catch(e) {
      e.printStackTrace();
      this.fail('Exception caught ' + e);
    }
  });

  it('should allow initializing the sandbox', function() {
    var context = vm.createContext({
      tacos: 'crunch',
    });
    expect(context).not.toBe( undefined );
    expect(typeof context).toBe("object");
    expect(context.dynjs.runtime).not.toBe( undefined );
    expect(context.tacos).toBe('crunch');
    try {
      tacos;
    } catch (err) {
      // expected and correct
    }
  });

  it("should allow setting properties in the context using []", function() {
    var context = vm.createContext();
    context['undocumented'] = 'feature';
    expect(context.undocumented).toBe('feature');
  })

  it("should allow running code in this context", function() {
    foo = 2;
    var code = "2+foo";
    var result = vm.runInThisContext( code );
    expect( result ).toBe( 4 );
  });

  it("should allow running code in a sandbox", function() {
    foo = 2;
    var code = "2+foo";
    var result = vm.runInNewContext( code, { foo: 4 } );
    expect( result ).toBe( 6 );
    expect( foo ).toBe( 2 );
  })

  it('should produce an error if a new context references something unknown', function(){
    foo = 2;
    var code = "2+foo";
    try {
      var result = vm.runInNewContext( code );
      expect(false).toBe(true);
    } catch (err) {
      // expected and correct
    }
  });

  it('should allow running in a contextualized sandbox', function() {
    var context = {};
    Object.defineProperty( context, 'taco', {
      get: function() {
        return "I'm a taco";
      }
    })

    context = vm.createContext( context );

    var result = vm.runInContext( "taco", context );
    expect( result ).toBe( "I'm a taco" );
  });

});

describe('Script objects', function() {
  it('should allow creating a Script and running in multiple new contexts', function() {
    var script = vm.createScript( '2+foo' );

    expect( script.runInNewContext({foo:2})).toBe( 4 );
    expect( script.runInNewContext({foo:20})).toBe( 22 );
    expect( script.runInNewContext({foo:5})).toBe( 7 );
  });

  it('should allow creating a Script and running in multiple times in this', function() {
    var script = vm.createScript( '2+foo' );

    foo = 2;
    expect( script.runInThisContext() ).toBe( 4 );
    foo = 20;
    expect( script.runInThisContext() ).toBe( 22 );
    foo = 5;
    expect( script.runInThisContext() ).toBe( 7 );
  });

})
