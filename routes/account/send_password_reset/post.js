var spawn = require('child_process').spawn;
var valid = require('valid');
var mongo = require('mongo');
var basic = require('basic');
var redisLimiter = require('../../../lib/redisLimiter.js');


module.exports = function (req, res, fields) {

  limiterOptions = {
    action: 'reset_password',
    identifier: req.connection.remoteip,
    limit: 2,
    during: 60 * 10, // 10 minutes
    nonBlocking: true
  };

  if (valid.email(fields.email)) {

    redisLimiter.check(limiterOptions, function (err, isLimited) {
      if (err) return basic.reserr(res, err);

      if (!isLimited) {

        mongo.main(function (err, collections) {
          if (err) return basic.reserr(res, err);

          var token = basic.getRandomCode(20);

          collections.users.findAndModify(
            {"email": fields.email},
            [],
            {$set: {"resetPassword": {"date": new Date(), "token": token}}},
            function (err, doc) {
            if (err) return basic.reserr(res, err);

            if (doc) {

              if (process.env.NODE_ENV === 'production') {

                // TODO noreply as twitter! (name Twitter)
                var mail = spawn('mail', [
                  '-s', 'Reset your socialnetwork password',
                  fields.email
                ]);

                mail.on('error', function (err) {
                  return basic.reserr(res, err);
                });

                mail.on('close', function (code) {
                  if (code !== 0) {
                    console.error('Error mail code ' + code);
                    basic.reserr(res);
                  } else {
                    redisLimiter.incr(limiterOptions,  function (err, done) {
                      if (err) return basic.reserr(res, err);
                      res.writeHead(200, {"Content-Type": 'text/plain'});
                      res.end('Email sended successfully to '
                        + fields.email
                        + '. You are going to receive a message, '
                        + 'check your spam.');
                    });
                  }
                });

                var message = 'Click on the link to reset your password: '
                  + 'http://socialnetwork.com/account/reset_password'
                  + '?user_id=' + doc._id.toHexString()
                  + '&token=' + token;

                mail.stdin.end(message);

              } else {
                var message = 'Click on the link to reset your password: '
                  + 'http://localhost:8000/account/reset_password'
                  + '?user_id=' + doc._id.toHexString()
                  + '&token=' + token;

                res.end(message);
              }

            } else {
              res.writeHead(400, {"Content-Type": 'text/plain'});
              res.end('There is no account associated with this email.');
            }

          });
        });

      } else {
        res.writeHead(429, {"Content-Type": 'text/plain'});
        res.end('We have alredy sent an email, please wait a moment.');
      }

    });

  } else {
    res.writeHead(400, {"Content-Type": 'text/plain'});
    res.end('Your email is invalid.');
  }

};
