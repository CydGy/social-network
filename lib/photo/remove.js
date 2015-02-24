var spawn = require('child_process').spawn;
var ObjectID = require('mongodb').ObjectID;
var mongo = require('mongo');
var basic = require('basic');

var CONST = require('CONST');

var util = require('util');
var logOn = true;

/**
 * Remove a photo and everything that is related.
 * The photo document is the last element removed to ensure the complete
 * deletion.
 *
 * @param {(string|ObjectID)} photoID
 * @param [photoDoc]
 */

module.exports = function (photoID, photoDoc, callback) {

  if (typeof photoID === 'string') {
    var photo_id = new ObjectID(photoID)
      , photoId = photoID;
  } else {
    var photo_id = photoID
      , photoId = photoID.toHexString();
  }

  if (typeof photoDoc === 'function') {
    callback = photoDoc;
    photoDoc = null;
  }

  mongo.main(function (err, collections) {
    if (err) return callback(err);

    if (photoDoc) {

      next(photoDoc);

    } else {

      collections.photos.findOne({ "_id": photo_id }, function (err, photoDoc) {
        if (err) return callback(err);
        if (!photoDoc) return callback(new Error('photo doesn\'t exists'));

        next(photoDoc);

      });

    }

    function next (photoDoc) {
      
      // remove comments
      collections.comments.remove({
        "photo_id": photo_id }, function (err, result) {
        if (err) return callback(err);

        if (logOn)
          util.log('photo %s: 1/6 %d comments removed.', photoId, result);

      // remove judgments
      collections.judgments.remove({
        $or: [ {"liked_photo_id": photo_id},
               {"disliked_photo_id": photo_id} ]
      }, function (err, result) {
        if (err) return callback(err);

        if (logOn)
          util.log('photo %s: 2/6 %d judgments removed.', photoId, result);

      // remove photoPath
      collections.users.update(
        { "_id": photoDoc.user_id, "photoPath": photoDoc.path },
        { $unset: { "photoPath": '' } },
      function (err, result) {
        if (err) return callback(err);

        if (logOn)
          util.log('photo %s: 3/6 %d user\'s photoPath removed.', photoId, result);


      /**
       * removing folder
       */

      var rm = spawn('rm',
        ['-r', basic.getPhotoPath(photo_id)],
        {cwd: CONST.PHOTOS_DIR});

      rm.on('error', function (err) {
        callback(err);
      });

      rm.stdout.on('data', function (data) {
        if (logOn)
          util.log('photo %s: rm - stdout: ' + data, photoId);
      });

      rm.stderr.on('data', function (data) {
        if (logOn)
          util.log('photo %s: rm - stderr: ' + data, photoId);
      });

      rm.on('close', function (code) {
        if (code !== 0) return callback(new Error('rm error code ' + code));

        if (logOn)
          util.log('photo %s: 4/6 Directory removed.', photoId);

        // remove reports
        collections.reports.remove({
          "report_photo_id": photo_id }, function (err, result) {
          if (err) return callback(err);

          if (logOn)
            util.log('photo %s: 5/6 %d reports removed.', photoId, result);

          // remove photo document
          collections.photos.remove({"_id": photo_id}, function (err, result) {
            if (err) return callback(err);

            if (logOn)
              util.log('photo %s: 6/6 Photo\'s document removed.', photoId);

            callback(null, true);
          });
        });

      });

      });
      });
      });

    }

  });

};
