var nodyn = require('nodyn');

module.exports.kMaxLength = 0x3fffffff;

// The following functions are expected by node, but we haven't needed them yet.
// When we do use them, we'll know where immediately since we're asking
// nodyn.notImplemented to throw an exception when these bindings are called.
module.exports.copyOnto = nodyn.notImplemented('copyOnto', true);
module.exports.hasExternalData = nodyn.notImplemented('hasExternalData', true);
module.exports.alloc = nodyn.notImplemented('alloc', true);
module.exports.dispose = nodyn.notImplemented('dispose', true);
