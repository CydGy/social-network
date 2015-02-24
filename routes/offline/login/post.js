var mongo = require('mongo');
var valid = require('valid');
var basic = require('basic');
var redisLimiter = require('../../../lib/redisLimiter.js');
var recaptcha = require('recaptcha');
var session = require('session');

var loginGet = require('./get.js');
var limitation = require('./limitation.js');


module.exports = function (req, res, fields) {

  var login = (valid.username(fields.login) && 'username')
           || (valid.email(fields.login) && 'email')
           || null;

  if (login && valid.password(fields.password)) {


    limitation(req.connection.remoteip, function (err, isLimited) {
      if (err) return basic.reserr(res, err);

    recaptcha.verify(req.connection.remoteip, fields, isLimited,
    function (err, success) {
      if (err && !err.userMistake) return basic.reserr(res, err);

        if (success) {


          /**
           * find user
           */

          var queryFindOne = {};
          if (login === 'username') queryFindOne.username = basic.usernameRegNoCase(fields.login);
          else queryFindOne.email = fields.login;

          mongo.main(function (err, collections) {
            if (err) return basic.reserr(res, err);
          collections.users.findOne(queryFindOne, function (err, user_doc) {
            if (err) return basic.reserr(res, err);

            var passwordMatch = user_doc
              && user_doc.password.hash === basic.getCryptedPassword(fields.password, user_doc.password.salt);

            if (user_doc && passwordMatch) {

              session.create({
                "req": req,
                "user_doc": user_doc,
                "remember": fields.remember
              }, function (err, cookies) {
                if (err) return basic.reserr(res, err);

                res.statusCode = 302;
                res.setHeader('Set-Cookie', cookies);
                res.setHeader('Location', '/');
                res.end();

              });

            } else {

              redisLimiter.incr({
                action: 'login',
                identifier: req.connection.remoteip,
                during: 10 * 60, // 10 minutes
                nonBlocking: true
              }, function (err) {
                if (err) return basic.reserr(res, err);
                loginGet(req, res, fields, { "wrong": true });
              });

            }

          }); });

          

        } else loginGet(req, res, fields, { "recaptchaErr": err });

    }); });

  } else loginGet(req, res, fields, { "wrong": true });

};
