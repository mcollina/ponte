
var express = require("express");
var http = require("http");
var topicsRegexp = /^\/topics\/(.+)$/;
var callback = require("callback-stream");
var bunyanExpress = require("./bunyanExpress");

function HTTP(opts, done) {
  if (!(this instanceof HTTP)) {
    return new HTTP(opts, done);
  }

  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }

  var that = this;
  this._persistence = opts.ponte.persistence;
  var logger = this._logger = opts.ponte.logger.child({ service: 'HTTP' });
  this.server = http.createServer(this.express(opts));
  this.server.listen(opts.port, function(err) {
    done(err, that);
    logger.info({ port: opts.port }, "server started");
  });
}

HTTP.prototype.close = function(done) {
  this.server.close(done);
};

HTTP.prototype.express = function(opts) {
  var app = express();
  var that = this;

  app.use(bunyanExpress.logger(this._logger));
  app.use(bunyanExpress.errorLogger(this._logger));

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
        opts.ponte.broker.publish(topic, payload, {}, function() {
          res.location('/topics/' + topic);
          res.send(204);
        });
      });
    }));
  });

  return app;
};

module.exports = HTTP;
