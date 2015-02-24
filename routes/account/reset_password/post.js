var mongo = require('mongo');
var valid = require('valid');
var basic = require('basic');
var ObjectID = require('mongodb').ObjectID;


module.exports = function (req, res, fields) {

  if (valid.id(fields.user_id)
    && valid.token(fields.token)) {

    if (valid.password(fields.password)) {

      if (fields.password === fields.password2) {

        mongo.main(function (err, collections) {
          if (err) return basic.reserr(res, err);

          // TODO a function that get password field
          // (for signup and this);

          var salt = basic.getRandomCode(20);

          collections.users.update(
            {
              "_id": new ObjectID(fields.user_id),
              "resetPassword.token": fields.token
            },
            {
              $set: {"password": {
                "transition": 0,
                "salt": salt,
                "hash": basic.getCryptedPassword(fields.password, salt)
              }},
              $unset: {"resetPassword": ''}
            },
          function (err, result) {
            if (err) return basic.reserr(res, err);

            if (result) {

              res.writeHead(200, {"Content-Type": 'text/plain'});
              res.end('You can now log in with your new password.');

            } basic.reserr(res, null, 400);

          });
        });

      } else basic.reserr(res, null, 400, 'Your passwords are not identical.');

    } else basic.reserr(res, null, 400, 'Your password is invalid.');

  } else basic.reserr(res, null, 400);

};
