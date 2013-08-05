
var mosca = require("mosca");
var persistences = {
  "level": mosca.persistence.LevelUp,
  "redis": mosca.persistence.Redis,
  "memory": mosca.persistence.Memory,
  "mongo": mosca.persistence.Mongo
};

module.exports = function(opts, done) {
  var factory = persistences[opts.type] || persistences.memory;
  delete opts.type;
  done(null, factory(opts));
};
