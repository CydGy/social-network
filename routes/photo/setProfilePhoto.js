var valid = require('valid');
var mongo = require('mongo');
var ObjectID = require('mongodb').ObjectID;
var basic = require('basic');


module.exports = function (req, res, fields) {

  if (valid.id(fields.photoId)) {

    mongo.main(function (err, collections) {
      if (err) return basic.reserr(res, err);

      collections.photos.findOne({ _id: new ObjectID(fields.photoId) }, function (err, photo_doc) {
        if (err) return basic.reserr(res, err);

        if (photo_doc && photo_doc.user_id.toHexString() === req.connection.userId) {

          // unset isProfilePhoto
          collections.photos.update({ user_id: req.connection.user_id, isProfilePhoto: true}, {$unset: {isProfilePhoto: ''}}, function (err, result) {
            if (err) return basic.reserr(res, err);
            console.log('unset last isProfilePhoto', result);

            // set isProfilePhoto
            collections.photos.update({ _id: photo_doc._id,}, {$set: {isProfilePhoto: true}}, function (err, result) {
              if (err) return basic.reserr(res, err);
              console.log('set new isProfilePhoto', result);

              // set photo path to user document
              collections.users.update({ _id: req.connection.user_id }, {$set: {photoPath: '/photos/' + basic.getPhotoPath(photo_doc._id)}}, function (err, result) {
                if (err) return basic.reserr(res, err);
                console.log('set new photoPath to user', result);

                basic.redirect_back(req, res);

              });
            });
          });

        }

      });
    });

  }

};
