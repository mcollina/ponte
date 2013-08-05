
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
    .option("-p, --http-port <n>", "the mqtt port to listen to", parseInt)
    .option("-c, --config <c>", "the config file to use (override every other option)")
    .option("-v, --verbose", "set the bunyan log to INFO")
    .option("--very-verbose", "set the bunyan log to DEBUG");

  program.parse(args);

  var opts = {
    logger: {
    },
    rest: {
      port: program.httpPort
    },
    mqtt: {
      port: program.mqttPort
    }
  };

  if (program.verbose) {
    opts.logger.level = 30;
  } else if (program.veryVerbose) {
    opts.logger.level = 20;
  } 

  if (program.config) {
    opts = require(path.resolve(program.config));
  }

  return this(opts, done);
};
