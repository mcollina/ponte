
var persistences = Object.create(require("mosca").persistence);
persistences.level = persistences.LevelUp;
persistences.redis = persistences.Redis;
persistences.memory = persistences.Memory;
persistences.mongo = persistences.Mongo;

module.exports = function(opts, done) {
  var factory = persistences[opts.type];

  if (opts.type === "memory") {
    done(null, factory(opts));
  } else {
    factory(opts, done);
  }
};
