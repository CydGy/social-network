var basic = require('basic');
var valid = require('valid');
var mongo = require('mongo');



module.exports = function (req, res, fields) {

  if (valid.email(fields.email)) {

    mongo.main(function (err, collections) {
      if (err) return basic.reserr(res, err);

      collections.users.findOne({ "email": fields.email }, { "_id": 1 }, function (err, doc) {
        if (err) return basic.reserr(res, err);
        
        var isAvailable = !doc;

        res.statusCode = 200;
        res.end(isAvailable.toString());

      });
    });

  } else {
    res.statusCode = 400;
    res.end();
  }

};
