
var commander = require("commander");
var pkg = require("../package.json");

module.exports = function(args, done) {

  args = args || [];

  var program = new commander.Command();
  var server = null;
  var runned = false;

  program
    .version(pkg.version)
    .option("-m, --mqtt-port <n>", "the mqtt port to listen to", parseInt)
    .option("-p, --http-port <n>", "the mqtt port to listen to", parseInt)

  program.parse(args);

  var opts = {
    rest: {
      port: program.httpPort
    },
    mqtt: {
      port: program.mqttPort
    }
  };

  this(opts, done);
};
