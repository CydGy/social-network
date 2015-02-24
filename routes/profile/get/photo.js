var mongo = require('mongo');
var basic = require('basic');
var view = require('../../../views/profile/photo.js');


module.exports = function (req, res, data_url) {

  mongo.main(function (err, collections) {
    if (err) return basic.reserr(res, err);

    collections.users.findOne({ "username": data_url.username }, function (err, user_doc) {
      if (err) return basic.reserr(res, err);

      if (user_doc) {

        collections.photos.findOne({ "_id": data_url.photo_id }, function (err, photo_doc) {
          if (err) return basic.reserr(res, err);

          if (photo_doc) {



            // TODO TO ADD LIMIT and to make page?
            collections.comments.find({ "photo_id": data_url.photo_id }, { "photo_id": 0 }).sort({ "posted": -1 }).toArray(function (err, comments_docs) {
              if (err) return basic.reserr(res, err);

              var users_ids = basic.getValues(comments_docs, 'author_id');

              collections.users.find({ "_id": { $in: users_ids } }, { "username": 1, "photoPath": 1 }).toArray(function (err, users_docs) {
                if (err) return basic.reserr(res, err);

                var embedded_comments = basic.associateByIds(comments_docs, 'author_id', users_docs, '_id', 'comment_doc', 'user_doc');

                /**
                 * judgments
                 */

                collections.judgments.find({ "$or": [ {"liked_photo_id": photo_doc._id}, {"disliked_photo_id": photo_doc._id}] }).sort({ "judged": -1 }).toArray(function (err, judgments_docs) {
                  if (err) return basic.reserr(res, err);

                  // attached users

                  var users_ids = basic.getValues(judgments_docs, 'user_id');

                  var judged = basic.getJudged(judgments_docs, req.connection.userId);

                  collections.users.find({ "_id": { $in: users_ids } }, { "username": 1, "photoPath": 1 }).toArray(function (err, users_docs) {
                    if (err) return basic.reserr(res, err);

                    var embedded_judgments = basic.associateByIds(judgments_docs, 'user_id', users_docs, '_id', 'judgment_doc', 'user_doc');

                    res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});

                    var data = {
                      "photoId": photo_doc._id.toHexString(),
                      "connected_user": {
                        "user_doc": req.user_doc,
                        "judged": judged,
                        "isProfile": req.connection.userId === user_doc._id.toHexString()
                      },
                      "profile_user": {
                        "user_doc": user_doc,
                        "photo_doc": photo_doc
                      },
                      "embedded_docs": {
                        "comments": embedded_comments,
                        "judgments": embedded_judgments
                      }
                    };

                    res.end(view(req, data));

                  });

                });

              });

            });



          } else {
            res.writeHead(404, { "Content-Type": 'text/plain; charset=UTF-8' });
            res.end('404 Not Found');
          }

        });

      } else {
        res.writeHead(404, { "Content-Type": 'text/plain; charset=UTF-8' });
        res.end('404 Not Found');
      }

    });

  });

};

