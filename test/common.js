global.sinon = require("sinon");
global.chai = require("chai");
global.expect = require("chai").expect;

var portCounter = 30042;
global.nextPort = function() {
  return ++portCounter;
};

var bunyan = require("bunyan");

global.globalLogger = bunyan.createLogger({
  name: "moscaTests",
  level: 60
});

global.ponteSettings = function() {
  return {
    mqtt: {
      port: nextPort(),
      logger: {
        name: "moscaTests",
        level: 60
      }
    }
  };
};

var sinonChai = require("sinon-chai");
chai.use(sinonChai);
