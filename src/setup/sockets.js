var fs = require('fs');
var path = require('path');
var sharedsession = require('express-socket.io-session');

/**
 * Checks to see if sockets are configured and then sets up socket.io
 * @param  {Ceres}   ceres
 * @param  {Express} app
 * @param  {HTTP}    server
 * @return {socket.io}
 */
module.exports = function(ceres, app, server) {
  var clientSocketEntryPath = path.resolve(ceres.config.folders.sockets, './index.js');

  try {
    // Can we access the file?
    fs.accessSync(clientSocketEntryPath);
  } catch(err) {
    if (err.code === 'ENOENT') {
      ceres.log._ceres.silly('Websockets configuration not found at %s', clientSocketEntryPath);
      return;
    } else {
      throw err;
    }
  }

  // Setup socket.io
  var io = require('socket.io')(server);

  // Get socket router
  var handler = require(clientSocketEntryPath);

  // Connect it to client connection event
  io.on('connection', handler.bind(ceres, io, ceres.Database));

  // Share express sessions
  io.use(sharedsession(app.get('sharedSession')));

  ceres.log._ceres.silly('Websockets configured');

  return io;
};
