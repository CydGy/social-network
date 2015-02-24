var log = require('util').log;
var valid = require('valid');
var mongo = require('mongo');
var ObjectID = require('mongodb').ObjectID;
var basic = require('basic');


module.exports = function (req, res, fields) {

  if (valid.id(fields.photoId)
    && (fields.reason === 'porno' || fields.reason === 'nohuman')
  ) {

    mongo.main(function (err, collections) {
      if (err) return basic.reserr(res, err);

      // search the photo reported
      collections.photos.findOne({"_id": new ObjectID(fields.photoId)}, function (err, photoDoc) {
        if (err) return basic.reserr(res, err);

        if (photoDoc) {

          var last10Minutes = new Date();
          last10Minutes.setMinutes(last10Minutes.getMinutes() - 10);

          // count reports for this user
          collections.reports.count({
            "user_id": req.connection.user_id,
            "date": { $gte: last10Minutes } }, function (err, count) {
            if (err) return basic.reserr(res, err);

            if (count < 10) { // start to 0

              // search report
              collections.reports.findOne({"report_photo_id": photoDoc._id}, function (err, doc) {
                if (err) return basic.reserr(res, err);

                if (!doc) {

                  var reportDoc = {
                    user_id: req.connection.user_id,
                    report_photo_id: photoDoc._id,
                    reason: fields.reason,
                    date: new Date()
                  };

                  // insert report
                  collections.reports.insert(reportDoc, function (err) {
                    if (err) return basic.reserr(res, err);
                    res.writeHead(200, {"Content-Type": 'text/plain'});
                    res.end('This photo has been reported successfully.');
                    log('A report has been submited.');
                  });

                } else {
                  res.writeHead(200, {"Content-Type": 'text/plain'});
                  res.end('This photo has already been reported.');
                }

              });

            } else {
              res.writeHead(429, {"Content-Type": 'text/plain'});
              res.end('429 Too Many Requests\n\nYou\'ve made too many reports.');
            }

          });

        } else {
          res.writeHead(400, {"Content-Type": 'text/plain'});
          res.end('400 Bad Request\n\nThe photo you reported does not exists.');
        }

      });
    });

  } else {
    res.writeHead(400, {"Content-Type": 'text/plain'});
    res.end('400 Bad Request\n\nYour fields are invalid.');
  }

};
