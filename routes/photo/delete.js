var valid = require('valid');
var mongo = require('mongo');
var ObjectID = require('mongodb').ObjectID;
var removePhoto = require('../../lib/photo/remove.js');
var basic = require('basic');



module.exports = function (req, res, fields) {

  if (valid.id(fields.photoId)) {

    mongo.main(function (err, collections) {
      if (err) return basic.reserr(res, err);

      collections.photos.findOne({ _id: new ObjectID(fields.photoId) }, function (err, photo_doc) {
        if (err) return basic.reserr(res, err);

        if (photo_doc && photo_doc.user_id.toHexString() === req.connection.userId) {

          removePhoto(photo_doc._id, photo_doc, function (err, done) {
            if (err) return basic.reserr(res, err);

            res.writeHead(302, {"Location": '/' + req.user_doc.username});
            res.end();

          });
        }

      });
    });

  }

};
