
// code borrowed from https://gist.github.com/bromanko/3952984

var bunyan = require('bunyan');

module.exports.logger = function logger(log) {
  if (typeof log !== 'object') {
    throw new TypeError('log (Object) required');
  }

  return function logger(req, res, next) {
    req.log = log;
    log.info({ req: bunyan.stdSerializers.req(req) }, 'start');
    next();
  };
};

module.exports.errorLogger = function(log) {
  if (typeof log !== 'object') {
    throw new TypeError('log (Object) required');
  }

  return function logger(err, req, res, next) {
    if (err) {
      log.trace({ err: err }, 'error');
    }

    next();
  };
};
