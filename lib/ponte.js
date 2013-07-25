
var mosca = require("mosca");

function Ponte(opts, done) {
  if (!(this instanceof Ponte)) {
    return new Ponte(opts, done);
  }

  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }

  opts.mqtt = opts.mqtt || {};

  this.options = opts;

  var that = this;
  this.mqtt = new mosca.Server(opts.mqtt, function(err) {
    done(err, that);
  });
}

Ponte.prototype.close = function(done) {
  this.mqtt.close(done);
};

module.exports = Ponte;
