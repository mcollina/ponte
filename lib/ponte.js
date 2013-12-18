/*******************************************************************************
 * Copyright (c) 18-dec-2013 University of Bologna
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Eclipse Distribution License v1.0 which accompany this distribution.
 *
 * The Eclipse Public License is available at 
 *    http://www.eclipse.org/legal/epl-v10.html
 * and the Eclipse Distribution License is available at 
 *   http://www.eclipse.org/org/documents/edl-v10.php.
 *
 * Contributors:
 *    Matteo Collina - initial API and implementation and/or initial documentation
 *******************************************************************************/

var mosca = require("mosca");
var HTTP = require("./http");
var CoAP = require("./coap");
var async = require("async");
var persistence = require("./persistence");
var ascoltatori = require("ascoltatori");
var bunyan = require("bunyan");
var xtend = require("xtend");

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

Ponte.prototype.close = function(done) {
  var that = this;
  var reversed = [].concat(subservers).reverse();
  async.eachSeries(reversed, function(obj, cb) {
    if (typeof that[obj.service].close === "function") {
      that[obj.service].close(cb);
    } else {
      cb();
    }
  }, done);
};

Ponte.cli = require("./cli");

module.exports = Ponte;
