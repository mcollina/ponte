
var coap = require('coap');
var topicsRegexp = /^\/topics\/(.+)$/;
var callback = require("callback-stream");

function CoAP(opts, done) {
  if (!(this instanceof CoAP)) {
    return new CoAP(opts, done);
  }

  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }

  var that = this;

  this._persistence = opts.ponte.persistence;

  this.coap = coap.createServer(function handler(req, res) {
    var match = req.url.match(topicsRegexp)
    var topic
    if (match) {
      topic = match[1];
      if (req.method === 'GET') {
        that._persistence.lookupRetained(topic, function(err, packets) {
          if (packets.length === 0) {
            res.statusCode = '4.04'
            res.end();
          } else {
            res.end(packets[0].payload);
          }
        });
      } else if (req.method === 'PUT') {
        req.pipe(callback(function(err, payload) {
          payload = payload.toString();
          var packet = { topic: topic, payload: payload, retain: true };
          that._persistence.storeRetained(packet, function() {
            opts.ponte.backend.publish(topic, payload, function() {
              res.statusCode = 204
              res.end();
            });
          });
        }));
      }
    }
  });

  this.coap.listen(opts.port, function(err) {
    done(err, that)
    opts.ponte.logger.info({ service: "CoAP", port: opts.port }, "server started");
  });
}

CoAP.prototype.close = function(done) {
  this.coap.close(done);
};

module.exports = CoAP
