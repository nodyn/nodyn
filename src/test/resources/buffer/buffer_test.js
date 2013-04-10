load('vertx_tests.js');

function testSafeConstructor() {
  var b = new Buffer(10);
  vassert.assertEquals(10, b.length);
  b[0] = -1;
  // This is a stupid workaround to the fact that javascript
  // has no distinction between long and int. DynJS represents
  // numbers as Longs. So here, 255 is a Long. But Buffer is
  // a Java object and it's underlying byte array are a bunch
  // of ints. So this test fails if we don't stringify it.
  vassert.assertEquals("255", "" + b[0]);
  vassert.testComplete();
}

function testDefaultConstructor() {
  var b = new Buffer('cheezy bits');
  vassert.assertEquals('cheezy bits', b.toString());
  vassert.testComplete();
}

initTests(this);
