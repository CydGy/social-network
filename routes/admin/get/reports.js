// TODO I think that mongodb have a map option, maybe it is more appropriate than associateByIds


var mongo = require('mongo');
var basic = require('basic');
var view = require('../../../views/admin/reports.js');


module.exports = function (req, res) {

  mongo.main(function (err, collections) {
    if (err) return basic.reserr(res, err);

    collections.reports.find({ "accepted": {$exists: false} }).toArray(function (err, reports_docs) {
      if (err) return basic.reserr(res, err);

      var users_ids = basic.getValues(reports_docs, 'user_id');

      collections.users.find({ _id: {$in: users_ids}}).toArray(function (err, reporters_users_docs) {
        if (err) return basic.reserr(res, err);

        // [ { report_doc:{}, user_doc:{} }, { a:{}, b:{} } ]
        var embedded_reports = basic.associateByIds(reports_docs, 'user_id', reporters_users_docs, '_id', 'report_doc', 'user_doc');

        var photos_ids = basic.getValues(reports_docs, 'report_photo_id');

        collections.photos.find({ _id: {$in: photos_ids}}).toArray(function (err, reported_photos_docs) {
          if (err) return basic.reserr(res, err);

          var k = reported_photos_docs.length;

          // TODO rename, always "docs" you know that it's a doc!
          // embedded.. rename to results only... (results with a `s` because it's an array,
          // there are many

          for (var i = 0, c = embedded_reports.length; i < c; i++) {

            for (j = 0; j < k; j++) {

              if (embedded_reports[i].report_doc.report_photo_id.toHexString()
                ===
                  reported_photos_docs[j]._id.toHexString()
              ) {

                embedded_reports[i].photo_doc = reported_photos_docs[j];

              }
                
            }
          }

          res.writeHead(200, {"Content-Type": 'text/html'});
          res.end(view(embedded_reports));

        });
      });
    });
  });

};
