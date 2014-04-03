
try {
  var mine = EventEmitter;
  expect(true).toBe(false);
} catch (err) {
  expect( err instanceof ReferenceError ).toBe(true);
}