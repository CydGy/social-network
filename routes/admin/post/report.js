var valid = require('valid');
var mongo = require('mongo');
var ObjectID = require('mongodb').ObjectID;
var basic = require('basic');


module.exports = function (req, res, fields) {

  if (valid.id(fields.reportId)
    && (fields.what === 'accept' || fields.what === 'refuse')
  ) {

    mongo.main(function (err, collections) {
      if (err) return basic.reserr(res, err);

      var report_id = new ObjectID(fields.reportId);

      if (fields.what === 'accept') {

        collections.reports.update(
          { _id: report_id },
          { $set: { "accepted": true } },
          function (err, result) {
          if (err) return basic.reserr(res, err);

          basic.redirect_back(req, res);

        });

      } else {

        collections.reports.remove({ _id: report_id }, function (err, result) {
          if (err) return basic.reserr(res, err);

          basic.redirect_back(req, res);

        });

      }

    });

  }

};
