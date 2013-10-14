global.sinon = require("sinon");
global.chai = require("chai");
global.expect = require("chai").expect;

var portCounter = 30042;
global.nextPort = function() {
  return ++portCounter;
};

var bunyan = require("bunyan");

global.ponteSettings = function() {
  return {
    logger: {
      name: "ponteTests",
      level: 60
    },
    http: {
      port: nextPort()
    },
    coap: {
      port: nextPort()
    },
    mqtt: {
      port: nextPort()
    }
  };
};

var sinonChai = require("sinon-chai");
chai.use(sinonChai);
