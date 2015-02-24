var net = require('net');
var util = require('util');

var server_status = require('./server.js').server_status;



module.exports = function () {

  var server = net.createServer();
  
  server.on('connection', function (socket) {

    util.log('client connected');

    socket.on('data', function (data) {

      data = data.toString('utf8');

      if (data === 'show') {
        socket.write(JSON.stringify(server_status));
      }

      // recaptcha login

      else if (data === 'login recaptcha on') {
        server_status.login.recaptchaOn = true;
        util.log('recaptcha for Log in is on');
      }

      else if (data === 'login recaptcha off') {
        server_status.login.recaptchaOn = false;
        util.log('recaptcha for Log in is off');
      }

      // recaptcha signup

      else if (data === 'signup recaptcha on') {
        server_status.signup.recaptchaOn = true;
        util.log('recaptcha for Sign up is on');
      }

      else if (data === 'signup recaptcha off') {
        server_status.signup.recaptchaOn = false;
        util.log('recaptcha for Sign up is off');
      }

      // globalLimitCount

      else if (/^signup globalLimitCount ([0-9]+)$/.test(data)) {
        server_status.signup.globalLimitCount = parseInt(RegExp.$1, 10);
        util.log('signup globalLimitCount to ' + RegExp.$1);
      }

      else if (/^login globalLimitCount ([0-9]+)$/.test(data)) {
        server_status.login.globalLimitCount = parseInt(RegExp.$1, 10);
        util.log('login globalLimitCount to ' + RegExp.$1);
      }

    });

    socket.on('end', function () {
      util.log('client disconnected');
    });

  });

  server.on('error', function (err) {
    if (err.code === 'EADDRINUSE') {
      console.log('server for clients - Address in use, retrying...');
      setTimeout(function () {
        server.close();
        server.listen(1337);
      }, 1000);
    } else {
      console.error('server for clients - ' + err);
    }
  });

  // TODO TO SECURE BECAUSE ITS IN LOCALHOST, EVERYONE CAN CONNECT AND SEND COMMANDS
  server.listen(1337, function () {
    console.log('server for clients - bound on %j', server.address());
  });

};
