var opts = {
  useGlobal: true,
  ignoreUndefined: false
};
if (parseInt(process.env['NODE_NO_READLINE'], 10)) {
  opts.terminal = false;
}
if (parseInt(process.env['NODE_DISABLE_COLORS'], 10)) {
  opts.useColors = false;
}
var repl = require('repl').start(opts);
repl.on('exit', function() {
  process.exit();
});
