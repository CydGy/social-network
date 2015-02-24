var mongo = require('mongo');
var valid = require('valid');
var basic = require('basic');
var redisLimiter = require('../../../lib/redisLimiter.js');
var recaptcha = require('recaptcha');
var session = require('session');

var signupGet = require('./get.js');
var signupLimitation = require('./limitation.js');



module.exports = function (req, res, fields) {

  mongo.main(function (err, collections) {
    if (err) return basic.reserr(res, err);


    var checks = {

      isValidUsername : valid.username(fields.username),
      isValidEmail    : valid.email(fields.email),
      isValidPassword : valid.password(fields.password),
      isAvailableUsername : undefined,
      isAvailableEmail    : undefined,

      isLimited: undefined,

      "recaptcha": {}

    };

    signupLimitation(req.connection.remoteip, function (err, isLimited) {
      if (err) return basic.reserr(res, err);

      checks.isLimited = isLimited;

      recaptcha.verify(req.connection.remoteip, fields, checks.isLimited,
      function (err, success) {
        if (err && !err.userMistake) return basic.reserr(res, err);

        checks.recaptcha.success = success;
        checks.recaptcha.err = err;

        /**
         * Parallel checks
         */

        var checkCount = 0, checkCountLength = 0;
        if (checks.isValidUsername) checkCountLength++;
        if (checks.isValidEmail) checkCountLength++;
        if (checkCountLength === 0) return endChecking();


        // check username available

        if (checks.isValidUsername) {

          collections.users.findOne(
            { "username": basic.usernameRegNoCase(fields.username) },
            { "fields": { "_id": 1 } }, function (err, found) {
            if (err) return basic.reserr(res, err);

            checks.isAvailableUsername = !found
              && !basic.isReservedUsername(fields.username);

            if (++checkCount === checkCountLength) endChecking();

          });

        }


        // check email available

        if (checks.isValidEmail) {

          collections.users.findOne(
            { "email": fields.email },
            { "fields": { "_id": 1 } }, function (err, found) {
            if (err) return basic.reserr(res, err);

            checks.isAvailableEmail = !found;

            if (++checkCount === checkCountLength) endChecking();

          });

        }


      });
    });


    function endChecking () {

      if ( checks.isValidUsername
        && checks.isValidEmail
        && checks.isValidPassword
        && checks.isAvailableUsername
        && checks.isAvailableEmail
        && checks.recaptcha.success
      ) {

        redisLimiter.incr({
          action: 'signup',
          identifier: req.connection.remoteip,
          during: 10 * 60, // 10 minutes
          nonBlocking: true
        }, function (err) {
          if (err) return basic.reserr(res, err);

          var salt = basic.getRandomCode(20);

          collections.users.insert({
            "username": fields.username,
            "email": fields.email,
            "password": {
              "transition": 0,
              "salt": salt,
              "hash": basic.getCryptedPassword(fields.password, salt)
            },
            "registered": new Date(),
            "signupValidationCode": basic.getRandomCode(20)
          }, function (err, docs) {
            if (err) return basic.reserr(res, err);

            var sessionOptions = {
              req: req,
              user_doc: docs[0],
              remember: true
            };

            session.create(sessionOptions, function (err, cookies) {
              if (err) return basic.reserr(res, err);

              res.statusCode = 302;
              res.setHeader('Set-Cookie', cookies);
              res.setHeader('Location', '/');
              res.end();

            });

          });

        });

      } else signupGet(req, res, fields, checks);

    }

  });

};
