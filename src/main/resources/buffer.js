
var Buffer = module.exports.Buffer = nodej.buffer;

// For now, let's not distinguish between SlowBuffer and
// Buffer. We'll see if we need to do otherwise later.
Buffer.prototype.SlowBuffer = Buffer;

