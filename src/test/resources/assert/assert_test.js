java.lang.System.err.println("ASSERT");

function testAssertOK() {
  java.lang.System.err.println("TEST ASSERT BEGIN");
  require('assert').ok(true);
  java.lang.System.err.println("TEST ASSERT END");
}
