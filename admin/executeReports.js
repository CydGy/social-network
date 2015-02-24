var mongo = require('mongo');
var removePhoto = require('../lib/photo/remove.js');


mongo.main(function (err, collections) {
  if (err) throw err;

  collections.reports.find({
    "accepted": true,
    "report_photo_id": {$exists: true} }).toArray(function (err, docs) {
    if (err) throw err;

    console.log('There is %d reports accepted', docs.length);

    if (docs.length === 0) process.exit(0);
    
    else {

      for (var i = 0, c = docs.length; i < c; i++) {

        (function (i) {

          removePhoto(docs[i].report_photo_id, function (err, done) {
            if (err) throw err;

            if (i === c - 1) {

              console.log('done');
              process.exit(0);

            }
            
          });

        })(i);
      }

    }

  });
});
