var server_status = exports.server_status = {

  "signup": {
    recaptchaOn: true,
    globalLimitCount: 1000
  },

  "login": {
    recaptchaOn: true,
    globalLimitCount: 5000
  }

};


process.argv.forEach(function (val, index, array) {

  if (val === 'signupRecaptchaOff') {
    server_status.signup.recaptchaOn = false;
    console.log('recaptcha for Sign up is off');
  }

  if (val === 'loginRecaptchaOff') {
    server_status.login.recaptchaOn = false;
    console.log('recaptcha for Log in is off');
  }

});


// TODO listen to a unix domain socket to avoid to be on the network
//require('./clientManager.js')();


// TODO a restarter in the event of a crash (see joyent doc error)


/**
 * Modules
 */

var http = require('http');
var CONST = require('CONST');
var sockets = require('sockets');


/**
 * Server
 */

var server = http.createServer();

server.once('listening', function () {
  console.log('server bound on %j', server.address());
});


server.on('connection', sockets.add);
server.on('request', require('./events/request.js'));


server.on('error', function (err) {
  if (err.code == 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(function () {
      server.close();
      server.listen(CONST.PORT, CONST.HOSTNAME);
    }, 1000);
  } else {
    console.error(err.stack);
  }
});


server.once('close', function () {
  console.log('The server is closed.');
  // TODO close Redis and MongoDB connections?
  process.exit(0);
});



/**
 * Process Events
 */

process.once('SIGINT', function () {
  console.log('stop accepting new connections');
  server.close();
  console.log('destroying sockets ...');
  var total = sockets.removeAll();
  console.log('%d sockets destroyed', total);
});

process.once('exit', function (code) {
  console.log('exiting with code', code);
});



/**
 * Let's go
 */

console.log('The server start listening ...');
server.listen(CONST.PORT);
