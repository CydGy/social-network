/**
 * Twitter doesn't limit following.
 * KISS = more simple + better performance
 */

var ObjectID = require('mongodb').ObjectID;
var mongo = require('mongo');
var valid = require('valid');
var basic = require('basic');


module.exports = function (req, res, fields, pathname) {

  if (valid.id(fields.photoId)) {

    if (pathname === '/like') {

      var photo_id = new ObjectID(fields.photoId);

      mongo.main(function (err, collections) {
        if (err) return basic.reserr(res, err);

        collections.photos.findOne({ "_id": photo_id }, function (err, photo_doc) {
          if (err) return basic.reserr(res, err);

          
          if (!photo_doc) return console.log('this photo doesn\'t exists');
          if (photo_doc.user_id.toHexString() === req.connection.userId) return console.log('you can\'t judge your own photo');


          collections.judgments.findOne({ "user_id": req.connection.user_id, $or: [{"liked_photo_id": photo_id}, {"disliked_photo_id": photo_id}] }, function (err, alreadyJudged) {
            if (err) return basic.reserr(res, err);

            if (alreadyJudged && alreadyJudged.liked_photo_id) return console.log('already liked this photo');

            var judgment_doc = {
              "user_id": req.connection.user_id,
              "liked_photo_id": photo_id,
              "judged": new Date()
            };

            var criteria = {
              "user_id": req.connection.user_id,
              "disliked_photo_id": photo_id,
            };

            collections.judgments.update(criteria, judgment_doc, { "upsert": true }, function (err, results) {
              if (err) return basic.reserr(res, err);

              var update = {
                $inc: {
                  "likesCount": 1
                }
              };

              if (alreadyJudged && alreadyJudged.disliked_photo_id) update.$inc.dislikesCount = -1;

              console.log(update);

              collections.photos.update({_id: photo_id}, update, function (err, results) {
                if (err) return basic.reserr(res, err);

                console.log('photo liked');
                res.statusCode = 200;
                res.end();

              });

            });

          });

        });

      });
    
    } else {

      var photo_id = new ObjectID(fields.photoId);

      mongo.main(function (err, collections) {
        if (err) return basic.reserr(res, err);

        collections.photos.findOne({ "_id": photo_id }, function (err, photo_doc) {
          if (err) return basic.reserr(res, err);

          if (!photo_doc) return console.log('this photo doesn\'t exists');
          if (photo_doc.user_id.toHexString() === req.connection.userId) return console.log('you can\'t judge your own photo');

          collections.judgments.findOne({ "user_id": req.connection.user_id, $or: [{"disliked_photo_id": photo_id}, {"liked_photo_id": photo_id}] }, function (err, alreadyJudged) {
            if (err) return basic.reserr(res, err);

            if (alreadyJudged && alreadyJudged.disliked_photo_id) return console.log('already disliked this photo');

            var judgment_doc = {
              "user_id": req.connection.user_id,
              "disliked_photo_id": photo_id,
              "judged": new Date()
            };

            var criteria = {
              "user_id": req.connection.user_id,
              "liked_photo_id": photo_id,
            };

            collections.judgments.update(criteria, judgment_doc, { "upsert": true }, function (err, results) {
              if (err) return basic.reserr(res, err);

              var update = {
                $inc: {
                  "dislikesCount": 1
                }
              };

              if (alreadyJudged && alreadyJudged.liked_photo_id) update.$inc.likesCount = -1;

              console.log(update);

              collections.photos.update({_id: photo_id}, update, function (err, results) {
                if (err) return basic.reserr(res, err);

                console.log('photo disliked');
                res.statusCode = 200;
                res.end();

              });

            });

          });

        });

      });

    }

  } else {
    res.statusCode = 400;
    res.end();
  }

};
