
var mosca = require("mosca");
var Rest  = require("./rest");
var async = require("async");
var persistence = require("./persistence");
var ascoltatori = require("ascoltatori");

var subservers = [{
  key: 'backend',
  factory: function(opts, done) {
    opts.json = false;
    ascoltatori.build(opts, function(ascoltatore) {
      done(null, ascoltatore);
    });
  }
}, {
  key: "persistence",
  factory: persistence
}, {
  key: "mqtt",
  factory: function(opts, cb) {
    opts.ascoltatore = opts.ponte.backend;
    var server = new mosca.Server(opts, cb);
    opts.ponte.persistence.wire(server);
  }
}, {
  key: "rest",
  factory: Rest
}];

function Ponte(opts, done) {
  if (!(this instanceof Ponte)) {
    return new Ponte(opts, done);
  }

  if (typeof opts === "function") {
    done = opts;
    opts = {};
  }

  this.options = opts;

  var that = this;

  async.eachSeries(subservers, function(obj, cb) {
    opts[obj.key] = opts[obj.key] || {};
    opts[obj.key].ponte = that;
    obj.factory(opts[obj.key], function(err, instance) {
      that[obj.key] = instance;
      cb(err);
    });
  }, function(err) {
    if (done) {
      done(err, that);
    }
  });
}

Ponte.prototype.close = function(done) {
  var that = this;
  async.each(subservers, function(obj, cb) {
    that[obj.key].close(cb);
  }, done);
};

Ponte.cli = require("./cli");

module.exports = Ponte;
