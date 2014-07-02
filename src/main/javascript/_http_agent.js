

var Agent = function() {
  this._agent = new io.nodyn.http.agent.AgentWrap( process.EVENT_LOOP );
}

Object.defineProperty( Agent.prototype, "maxSockets", {
  get: function() {
    return this._agent.maxSockets;
  },
  set: function(v) {
    this._agent.maxSockets = v;
  },
  enumerable: true,
});

Object.defineProperty( Agent.prototype, "sockets", {
  get: function() {
    return this._agent.sockets;
  },
  enumerable: true,
});

Object.defineProperty( Agent.prototype, "requests", {
  get: function() {
    return this._agent.requests;
  },
  enumerable: true,
});


module.exports.Agent = Agent;
module.exports.globalAgent = new Agent();