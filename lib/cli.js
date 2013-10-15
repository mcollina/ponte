
var commander = require("commander");
var pkg = require("../package.json");
var path = require("path");

module.exports = function(args, done) {

  args = args || [];

  var program = new commander.Command();
  var server = null;
  var runned = false;

  program
    .version(pkg.version)
    .option("-m, --mqtt-port <n>", "the mqtt port to listen to", parseInt)
    .option("-p, --http-port <n>", "the http port to listen to", parseInt)
    .option("-a, --coap-port <n>", "the coap port to listen to", parseInt)
    .option("-d, --db <path>", "the path were to store the database")
    .option("-c, --config <c>", "the config file to use (override every other option)")
    .option("-v, --verbose", "set the bunyan log to INFO")
    .option("--very-verbose", "set the bunyan log to DEBUG");

  program.parse(args);

  var opts = {
    logger: {},
    http: {},
    mqtt: {},
    coap: {},
    persistence: {}
  };

  if (program.verbose) {
    opts.logger.level = 30;
  } else if (program.veryVerbose) {
    opts.logger.level = 20;
  }

  if (program.httpPort) {
    opts.http.port = program.httpPort;
  }

  if (program.mqttPort) {
    opts.mqtt.port = program.mqttPort;
  }

  if (program.coapPort) {
    opts.coap.port = program.coapPort;
  }

  if (program.db) {
    opts.persistence.path = program.db;
    opts.persistence.type = "level";
  }

  if (program.config) {
    opts = require(path.resolve(program.config));
  }

  return this(opts, done);
};
