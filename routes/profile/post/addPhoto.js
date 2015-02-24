// TODO add min size for photo, or resize with >
// TODO "crop your photo" as github, weheartit
// TODO Face recognition


var fs = require('fs');
var spawn = require('child_process').spawn;

var converter = require('converter');
var formidable = require('formidable');

var mongo = require('mongo');
var ObjectID = require('mongodb').ObjectID;

var basic = require('basic');
var Photo = require('../../../lib/photo.js');
var CONST = require('CONST');



module.exports = function (req, res) {

  var maxLength = converter.getOctets({ "Mo": 10 });
  var maxSize = maxLength;

  if (req.headers['content-length'] <= maxLength) {

    var form = new formidable.IncomingForm();

    form.uploadDir = CONST.UPLOADS_DIR;


    form.parse(req, function (err, fields, files) {
      if (err) return basic.reserr(res, err);

      // formidable, fs.stat, imagemagick

      if (files.photo) {
      if (files.photo.type === 'image/jpeg' || files.photo.type === 'image/jpg' || files.photo.type === 'image/png') { // only string verification...
      if (files.photo.size <= maxSize) {

        mongo.main(function (err, collections) {
          if (err) return basic.reserr(res, err);

          // TODO to write function for this in basic.js
          var last10Minutes = new Date();
          last10Minutes.setMinutes(last10Minutes.getMinutes() - 10);

          collections.photos.count({ "user_id":  req.connection.user_id, "posted": {$gte: last10Minutes} }, function (err, count) {
            if (err) return basic.reserr(res, err);

            if (count < 10) { // start to 0

              var photo_options = {
                "path": files.photo.path,
                "user_id": req.connection.user_id,
                "sizes": ['50x50', '200x200', '400x400']
              };

              var photo = new Photo(photo_options);

              photo.check(function (err) {
                if (err) return basic.reserr(res, err);
                if (photo.isValid) {

                  photo.saveOriginal(function (err) {
                    if (err) return basic.reserr(res, err);
                  photo.resize(function (err) {
                    if (err) return basic.reserr(res, err);


                    // update photo if it is the first
                    collections.users.update(
                      { "_id": photo.doc.user_id, "photoPath": {$exists: false} },
                      { $set: {"photoPath": photo.doc.path } },
                      function (err, result) {
                      if (err) return basic.reserr(res, err);

                      if (result) photo.doc.isProfilePhoto = true;

                      collections.photos.insert(photo.doc, function (err) {
                        if (err) return basic.reserr(res, err);

                        basic.redirect_back(req, res);

                      });

                    });


                  }); });

                } else {
                  console.log('image invalid');
                }
              });

            } else {
              res.writeHead(400, {"Content-Type": 'text/plain'}); // TODO addapt code
              res.end('wait, you\'ve made too many uploads');
            }

          });
        });

      }
      }
      }

    });


  } else {

    // 413 Request Entity Too Large
    res.writeHead(413, {"Content-Type": "text/plain; charset=UTF-8"});
    res.end('413 ' + http.STATUS_CODES[413]);

  }

};
