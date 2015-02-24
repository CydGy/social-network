// TODO to do a big test with 10,000 users

var mongo = require('mongo');
var valid = require('valid');
var basic = require('basic');
var view = require('../../views/games/overall-classification.js');


module.exports = function (req, res) {

  mongo.main(function (err, db) {
    if (err) return basic.reserr(res, err);

    var nbPerPage = 7 * 12;
    var page = valid.int(req.urlparsed.query.page)
            && parseInt(req.urlparsed.query.page, 10)
            || 1;

    // does it is better to incr a global counter?
    db.photos.count({ "isProfilePhoto": { $exists: true } }, function (err, photosCount) {
      if (err) return basic.reserr(res, err);

      var pagesCount = Math.ceil(photosCount / nbPerPage);

      db.photos.find(
        { "isProfilePhoto": { $exists: true } },
        { "user_id": 1, "path": 1, "likesCount": 1, "dislikesCount": 1 }
      ).skip((page - 1) * nbPerPage).limit(nbPerPage).sort({ "scoreCount": -1 }).toArray(function (err, photos_docs) {
        if (err) return basic.reserr(res, err);

        var users_id = basic.getValues(photos_docs, 'user_id');

        // find associated users (does it is better to add username in the photos_docs, and when update, update all yours photos?)
        db.users.find({ "_id": { $in: users_id } }, { "username": 1 }).toArray(function (err, users_docs) {
          if (err) return basic.reserr(res, err);

          var embedded_photos = basic.associateByIds(photos_docs, 'user_id', users_docs, '_id', 'photo_doc', 'user_doc');

          res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
          res.end( view(req, req.user_doc, embedded_photos, pagesCount, page) );

        });
      });
    });
  });

};
