/*******************************************************************************
 * Copyright (c) 18-dec-2013 Matteo Collina
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Eclipse Distribution License v1.0 which accompany this distribution.
 *
 * The Eclipse Public License is available at 
 *    http://www.eclipse.org/legal/epl-v10.html
 * and the Eclipse Distribution License is available at 
 *   http://www.eclipse.org/org/documents/edl-v10.php.
 *
 * Contributors:
 *    Matteo Collina - initial API and implementation and/or initial documentation
 *******************************************************************************/

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
