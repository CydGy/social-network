var view = require('../../../views/profile/profile.js');
var mongo = require('mongo');
var basic = require('basic');


module.exports = function (req, res, username) {

  mongo.main(function (err, collections) {
    if (err) return basic.reserr(res, err);

    collections.users.findOne({ "username": username }, function (err, user_doc) {
      if (err) return basic.reserr(res, err);

      if (user_doc) {

        collections.photos.find({ "user_id": user_doc._id }).toArray(function (err, photos_docs) {
          if (err) return basic.reserr(res, err);

          res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});

          var isProfileUser = req.connection.userId === user_doc._id.toHexString();

          var data = {
            "profile": {
              user_doc: user_doc,
              photos_docs: photos_docs
            },
            "connected": {
              user_doc: req.user_doc,
              isProfileUser: isProfileUser
            }
          };

          res.end(view(req, data));

        });

      } else respondNotFound();

    });
  });

  // TODO there is no users with this username
  function respondNotFound () {
    res.writeHead(404, {"Content-Type": "text/plain; charset=UTF-8"});
    res.end('404 Not Found');
  }

};
