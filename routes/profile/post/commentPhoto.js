var mongo = require('mongo');
var basic = require('basic');


module.exports = function (req, res, fields, url_data) {

  mongo.main(function (err, collections) {
    if (err) return basic.reserr(res, err);

    if (fields.text.length && fields.text.length <= 1000) {

      var date = new Date();
      date.setHours(date.getHours() - 1);

      // 1h, ~ 1200 comments max = 3 per second during 1 hour (no atomic)
      collections.comments.count({ "author_id": req.connection.user_id, "posted": { "$gte": date } }, function (err, commentsCount) {
        if (err) return basic.reserr(res, err);

        if (commentsCount <= 1200) {

          var doc = {

            "photo_id": url_data.photo_id,
            "author_id": req.connection.user_id,

            "posted": new Date(),
            "text": fields.text

          };

          collections.comments.insert(doc, function (err) {
            if (err) return basic.reserr(res, err);

            basic.redirect_back(req, res);

          });

        } else basic.respondError(res, 429);

      });

    } else basic.respondError(res, 400);

  });

};
