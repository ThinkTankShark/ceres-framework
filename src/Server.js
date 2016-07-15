/*******************************************************************************
 * Worker Instance
 ******************************************************************************/
var moment = require('moment');
var Application = require('./setup/express');
var Setup = require('./setup');
var http = require('http');

module.exports = function(ceres) {

  // The master doesn't do very much besides load the workers so we also use it
  // handle the queues. If a queue crashes then the master will crash as well...
  if (ceres.config.folders.queues) {
    // Load any files in this folder and apply this config
    Setup.directory(ceres.config.folders.queues, {
      config: ceres.config
    });

    ceres.log._ceres.silly('Queues ceres.configured');
  }

  // Setup Express
  var app = Application.call(ceres, ceres);
  ceres.log._ceres.silly('Express ceres.configured');

  // Setup DB
  var db = require('./db')(ceres.config);
  app.set('db', db);

  // Setup server
  var server = http.Server(app);

  // Setup any sockets
  Setup.sockets(ceres, app, server);

  return server;
};