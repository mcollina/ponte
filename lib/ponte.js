
var mosca = require("mosca");
var HTTP = require("./http");
var CoAP = require("./coap");
var async = require("async");
var persistence = require("./persistence");
var ascoltatori = require("ascoltatori");
var bunyan = require("bunyan");
var xtend = require("xtend");
var EventEmitter = require("events").EventEmitter;
var util = require("util");

var subservers = [{
  service: "logger",
  factory: function(opts, done) {
    delete opts.ponte;
    done(null, bunyan.createLogger(opts));
  },
  defaults: {
    name: "ponte",
    level: 40
  }
}, {
  service: 'broker',
  factory: function(opts, done) {
    opts.json = false;
    ascoltatori.build(opts, function(ascoltatore) {
      done(null, ascoltatore);
    });
  }
}, {
  service: "persistence",
  factory: persistence,
  defaults: {
    type: "memory"
  }
}, {
  service: "mqtt",
  factory: function(opts, cb) {
    opts.ascoltatore = opts.ponte.broker;
    opts.logger = xtend(opts.logger || {}, {
      childOf: opts.ponte.logger,
      level: opts.ponte.logger.level(),
      service: "MQTT"
    });
    var server = new mosca.Server(opts, cb);
    server.on('published', function moscaPonteEvent(packet) {
      opts.ponte.emit('updated', packet.topic, packet.payload);
    });
    opts.ponte.persistence.wire(server);
  }
}, {
  service: "http",
  factory: HTTP,
  defaults: {
    port: 3000
  }
}, {
  service: "coap",
  factory: CoAP,
  defaults: {
    port: 5683
  }
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
  var reversed = [].concat(subservers).reverse();
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
