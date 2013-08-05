
var express = require("express");
var http = require("http");
var topicsRegexp = /^\/topics\/(.+)$/;
var callback = require("callback-stream");
var bunyanExpress = require("./bunyanExpress");

function Rest(opts, done) {
  if (!(this instanceof Rest)) {
    return new Rest(opts, done);
  }

  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }

  var that = this;
  this._persistence = opts.ponte.persistence;
  this.http = http.createServer(this.express(opts));
  this.http.listen(opts.port, function(err) {
    done(err, that);
  });
  opts.ponte.logger.info({ service: "REST", port: opts.port }, "server started");
}

Rest.prototype.close = function(done) {
  this.http.close(done);
};

Rest.prototype.express = function(opts) {
  var app = express();
  var that = this;

  app.use(bunyanExpress.logger(opts.ponte.logger));
  app.use(bunyanExpress.errorLogger(opts.ponte.logger));

  app.get(topicsRegexp, function(req, res){
    var topic = req.params[0];
    
    that._persistence.lookupRetained(topic, function(err, packets) {
      if (packets.length === 0) {
        res.send(404);
      } else {
        res.send(packets[0].payload);
      }
    });
    
  });

  app.put(topicsRegexp, function(req, res) {
    var topic = req.params[0];
    req.pipe(callback(function(err, payload) {
      payload = payload.toString();
      var packet = { topic: topic, payload: payload, retain: true };
      that._persistence.storeRetained(packet, function() {
        opts.ponte.backend.publish(topic, payload, function() {
          res.send(204);
        });
      });
    }));
  });

  return app;
};

module.exports = Rest;
