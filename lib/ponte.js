
var async = require("async");
var servers = require("./servers.js");
var EventEmitter = require("events").EventEmitter;
var util = require("util");
var xtend = require("xtend");

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

  async.eachSeries(servers, function(obj, cb) {
    opts[obj.service] = xtend(obj.defaults, opts[obj.service]);
    opts[obj.service].ponte = that;
    obj.factory(opts[obj.service], function(err, instance) {
      that[obj.service] = instance;
      cb(err);
    });
  }, function(err) {
    if (done) {
      done(err, that);
    }
  });
}

util.inherits(Ponte, EventEmitter);

Ponte.prototype.close = function close(done) {
  var that = this;
  var reversed = [].concat(servers).reverse();
  async.eachSeries(reversed, function closeEverything(obj, cb) {
    if (typeof that[obj.service].close === "function") {
      that[obj.service].close(cb);
    } else {
      cb();
    }
  }, done);
};

Ponte.cli = require("./cli");

module.exports = Ponte;
