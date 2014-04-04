var obj = {};
obj.__defineGetter__('props', function() { return require('./properties'); });
module.exports = obj;
