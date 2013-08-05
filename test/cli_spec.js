
var ponte = require("../");
var async = require("async");

describe("ponte.cli", function() {

  var servers = null;

  beforeEach(function() {
    args = ["node", "ponte"];
    servers = [];
  });

  afterEach(function(done) {
    async.parallel(servers.map(function(s) {
      return function(cb) {
        s.close(cb);
      };
    }), function() {
      done();
    });
  });

  var startServer = function(done, callback) {
    return ponte.cli(args, function(err, server) {
      if (server) {
        servers.unshift(server);
        callback(server);
      }
      done(err);
    });
  };

  it("must be a function", function() {
    expect(ponte.cli).to.be.a("function");
  });

  it("should start a ponte", function(done) {
    startServer(done, function(server) {
      expect(server).to.be.instanceOf(ponte);
    });
  });

  it("should start a ponte on a specific HTTP port", function(done) {
    args.push("-p");
    args.push("3042");
    startServer(done, function(server) {
      expect(server.options.rest.port).to.be.eql(3042);
    });
  });

  it("should start a ponte on a specific MQTT port", function(done) {
    args.push("-m");
    args.push("3042");
    startServer(done, function(server) {
      expect(server.options.mqtt.port).to.be.eql(3042);
    });
  });

  it("should start a ponte on a specific HTTP port (long)", function(done) {
    args.push("--http-port");
    args.push("3042");
    startServer(done, function(server) {
      expect(server.options.rest.port).to.be.eql(3042);
    });
  });

  it("should start a ponte on a specific MQTT port (long)", function(done) {
    args.push("--mqtt-port");
    args.push("3042");
    startServer(done, function(server) {
      expect(server.options.mqtt.port).to.be.eql(3042);
    });
  });

  it("should support a verbose option by setting the bunyan level to 30", function(done) {
    args.push("-v");
    var s = startServer(done, function(server) {
      expect(server.logger.level()).to.equal(30);
    });

    if (s.logger) {
      s.logger.streams.pop();
    }
  });

  it("should support a very verbose option by setting the bunyan level to 20", function(done) {
    args.push("--very-verbose");
    var s = startServer(done, function(server) {
      expect(server.logger.level()).to.equal(20);
    });

    if (s.logger) {
      s.logger.streams.pop();
    }
  });

  it("should support a config option (short)", function(done) {
    args.push("-c");
    args.push("test/sample_config.js");
    startServer(done, function(server) {
      expect(server.options.logger).to.have.property("name", "Config Test Logger");
    });
  });

  it("should support a config option (long)", function(done) {
    args.push("--config");
    args.push("test/sample_config.js");
    startServer(done, function(server) {
      expect(server.options.logger).to.have.property("name", "Config Test Logger");
    });
  });

  it("should support a config option with an absolute path", function(done) {
    args.push("-c");
    args.push(process.cwd() + "/test/sample_config.js");
    startServer(done, function(server) {
      expect(server.options.logger).to.have.property("name", "Config Test Logger");
    });
  });
});
