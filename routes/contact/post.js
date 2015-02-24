var spawn = require('child_process').spawn;
var mongo = require('mongo');
var valid = require('valid');
var redisLimiter = require('../../lib/redisLimiter.js');
var recaptcha = require('recaptcha');
var log = require('util').log;

var contactGet = require('./get.js');



module.exports = function (req, res, fields) {

  var limiterOptions = {
    action: 'contact',
    identifier: req.connection.remoteip,
    limit: 1,
    during: 10 * 60 // 10 minutes
  };

  var checks = {
    "isValidEmail": valid.email(fields.email),
    "isValidMessage": valid.contactMessage(fields.message),
    "isLimited": undefined
  };


  redisLimiter.check(limiterOptions, function (err, isLimited) {
    if (err) return basic.reserr(res, err);

    checks.isLimited = isLimited;

  recaptcha.verify(req.connection.remoteip, fields, function (err, success) {
    if (err && !err.userMistake) return basic.reserr(res, err);

    checks.recaptchaErr = err;

    if ( success
      && checks.isValidEmail
      && checks.isValidMessage
      && !checks.isLimited
    ) {

      redisLimiter.incr(limiterOptions, function (err) {
        if (err) return basic.reserr(res, err);

        // send email to ineedpracticing@gmail.com

        if (process.env.NODE_ENV === 'production') {

          var mail = spawn('mail', [
            '-s', 'You have a new message',
            'ineedpracticing@gmail.com'
          ]);

          mail.on('error', function (err) {
            basic.reserr(res, err);
          });

          mail.on('close', function (code) {
            if (code !== 0) {
              console.error('Error: mail close with code ' + code);
              basic.reserr(res);
            } else {
              contactGet(req, res, null, null, true);
              log('You get a new message.');
            }
          });

          var body = fields.email + '\n\n'
            + fields.message + '\n\n'
            + new Date();

          mail.stdin.end(body);

        } else {
          contactGet(req, res, null, null, true);
        }

        /*
        mongo.main(function (err, collections) {
          if (err) return basic.reserr(res, err);

          collections.contactMessages.insert({
            "email": fields.email,
            "message": fields.message,
            "date": new Date()
          }, function (err) {
            if (err) return basic.reserr(res, err);


          });

        });
        */

      });

    } else contactGet(req, res, fields, checks);

  }); });

};
