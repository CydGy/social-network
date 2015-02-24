var valid = require('valid');
var mongo = require('mongo');
var basic = require('basic');



module.exports = function (req, res, fields) {

  if (valid.username(fields.username)) {

    mongo.main(function (err, collections) {
      if (err) return basic.reserr(res, err);

      collections.users.findOne({ "username": basic.usernameRegNoCase(fields.username) }, { "_id": 1 },  function (err, doc) {
        if (err) return basic.reserr(res, err);

        var isAvailable = !doc && !basic.isReservedUsername(fields.username);

        res.statusCode = 200;
        res.end(isAvailable.toString());

      });
    });

  } else {
    res.statusCode = 400;
    res.end();
  }

};

