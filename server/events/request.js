// TODO urlenparser -> re-read joyent error handling doc
var url = require('url');
var querystring = require('querystring');
var session = require('session');
var valid = require('valid');
var mongo = require('mongo');
var ObjectID = require('mongodb').ObjectID;
var basic = require('basic');
var urlenparser = require('urlenparser');

var routesDir = '../../routes/';


module.exports = function (req, res) {

  var urlparsed = url.parse(req.url, true);
  var pathname = urlparsed.pathname;
  req.urlparsed = urlparsed;

  // TODO attention if proxy, you need x-forwarded for
  req.connection.remoteip = req.connection.remoteAddress;
  var useragent = req.headers['user-agent'];
  req.connection.useragent = valid.useragent(useragent) && useragent;

  req.lang = basic.getLang(req);


  function getUserDoc (user_id, callback) {

    // to update regex
    if (!user_id || /^\/(photos|img|css|js)\//.test(pathname) ) return callback();

    mongo.main(function (err, collections) {
      if (err) return callback(err);

      collections.users.findOne({ "_id": user_id }, function (err, user_doc) {
        if (err) return callback(err);

        req.user_doc = user_doc;
        callback();

      });
    });

  }

  session.open(req, function (err, sessionOpened) {
    if (err) return basic.reserr(res, err, 500);

    getUserDoc(req.connection.user_id, function (err) {
      if (err) return basic.reserr(res, err, 500);

      if (req.headers.host && req.headers.host.match(/^www/) !== null) {
        res.writeHead(302, {
          "Location": 'http://' + req.headers.host.replace(/^www\./, '')
            + req.url
        });
        res.end();
        return;
      }

      /***************
       * GET Methods *
       ***************/

       // pathname.substr(0, 5) === '/poll'
       // var x = pathname.replace(/[^0-9]*/, '');

      if (req.method === 'GET') {



        // analytics done
        if (pathname === '/') {
          require(routesDir + 'games/overall-classification.js')(req, res);
        }

        else if ( /\.js$/.test(pathname) ) require(routesDir + 'public.js')(req, res, 'js');
        else if ( /\.css$/.test(pathname) ) require(routesDir + 'public.js')(req, res, 'css');
        else if ( /^\/photos\//.test(pathname) ) require(routesDir + 'public.js')(req, res, 'photos');
        else if ( /\.(gif|png|jpg|svg)$/.test(pathname) ) require(routesDir + 'public.js')(req, res, 'img');

        // analytics done
        else if (pathname === '/login' && !sessionOpened) {
          require(routesDir + 'offline/login/get.js')(req, res);
        }

        ///////////////// password

        // analytics done
        else if (pathname === '/account/send_password_reset' && !sessionOpened) {
          require(routesDir + 'account/send_password_reset/get.js')(req, res);
        }

        /*
        else if (pathname === '/account/reset_email_sent' && !sessionOpened) {
          require(routesDir + 'account/reset_email_sent/get.js')(req, res);
        }
        */

        // analytics done
        else if (pathname === '/account/reset_password' && !sessionOpened) {
          require(routesDir + 'account/reset_password/get.js')(req, res);
        }

        /////////////////////

        // analytics done
        else if (pathname === '/signup' && !sessionOpened) {
          require(routesDir + 'offline/signup/get.js')(req, res);
        }
        

        /**
         * footer
         */

        // analytics done
        else if (pathname === '/tos') {
          require(routesDir + 'tos.js')(req, res);  
        }

        // analytics done
        else if (pathname === '/privacy') {
          require(routesDir + 'privacy.js')(req, res);  
        }

        // analytics done
        else if (pathname === '/contact') {
          require(routesDir + 'contact/get.js')(req, res);
        }

        // analytics done
        else if (pathname === '/about') {
          require(routesDir + 'about.js')(req, res);
        }

        // analytics done
        else if (pathname === '/lang') {
          require(routesDir + 'lang.js')(req, res);  
        }

        //----

        else if (pathname === '/signout') require(routesDir + 'signout.js')(req, res);

        // analytics done
        else if (pathname === '/admin/reports' && sessionOpened && req.user_doc.admin) {
          require(routesDir + 'admin/get/reports.js')(req, res);
        }

        // analytics done
        else if (/^\/report\/photo\/([0-9a-fA-F]{24})$/.test(pathname) && sessionOpened) {
          var photoId = RegExp.$1;
          require(routesDir + 'report/photo/get.js')(req, res, photoId);
        }

        // profiles

        // analytics done
        else if ( /^\/([A-Za-z0-9]{1,15})$/.test(pathname) ) {
          var username = RegExp.$1;
          require(routesDir + 'profile/get/profile.js')(req, res, username);
        }

        // analytics done
        else if ( /^\/([A-Za-z0-9]{1,15})\/photo\/([0-9a-fA-F]{24})$/.test(pathname) ) {
          var data_url = { "username": RegExp.$1, "photo_id": new ObjectID(RegExp.$2) };
          require(routesDir + 'profile/get/photo.js')(req, res, data_url);
        }
        
        else basic.respondError(res, 404);



      /****************
       * POST Methods *
       ****************/

       // TODO should you do one urlenparser? or not? 
       // the more important is to stay logic...
       // to parse before knowing the pathname? noooo...

      } else if (req.method === 'POST') {


        if (pathname === '/login' && !sessionOpened) {

          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + 'offline/login/post.js')(req, res, fields);
          });

        }

        else if (pathname === '/account/send_password_reset' && !sessionOpened) {
          
          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + 'account/send_password_reset/post.js')(req, res, fields);
          });

        }

        else if (pathname === '/account/reset_password' && !sessionOpened) {
          
          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + 'account/reset_password/post.js')(req, res, fields);
          });

        }

        else if (pathname === '/signup' && !sessionOpened) {
          
          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + 'offline/signup/post.js')(req, res, fields);
          });

        }


        else if (pathname === '/contact') {

          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + 'contact/post.js')(req, res, fields);
          });

        }


        else if (pathname === '/like' || pathname === '/dislike') {

          if (!sessionOpened) return basic.redirect_login(res);

          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + 'ajax/judge.js')(req, res, fields, pathname);
          });

        }

        else if (pathname === '/available_username') {

          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + 'ajax/available_username.js')(req, res, fields);
          });

        }

        else if (pathname === '/available_email') {

          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + 'ajax/available_email.js')(req, res, fields);
          });

        }

        // add photo

        else if (pathname === '/profile/addPhoto') {

          if (!sessionOpened) return basic.redirect_login(res);

          require(routesDir + 'profile/post/addPhoto.js')(req, res);

        }

        else if (pathname === '/photo/delete' && sessionOpened) {
          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + '/photo/delete.js')(req, res, fields);
          });
        }

        else if (pathname === '/photo/setProfilePhoto' && sessionOpened) {
          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + '/photo/setProfilePhoto.js')(req, res, fields);
          });
        }

        else if (pathname === '/admin/report' && sessionOpened && req.user_doc.admin) {
          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + '/admin/post/report.js')(req, res, fields);
          });
        }



        // comment photo

        else if (/^\/([A-Za-z0-9]{1,15})\/photo\/([0-9a-fA-F]{24})\/comment$/.test(pathname)) {

          if (!sessionOpened) return basic.redirect_login(res);
          
          var url_data = { "username": RegExp.$1, "photo_id": new ObjectID(RegExp.$2) }

          // text
          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + 'profile/post/commentPhoto.js')(req, res, fields, url_data);
          });

        }

        else if (pathname === '/report/photo' && sessionOpened) {
          urlenparser(req, function (err, fields) {
            if (err) return basic.reserr(res, err, err.statusCode);
            require(routesDir + 'report/photo/post.js')(req, res, fields);
          });
        }

        else basic.respondError(res, 404);

      } else {
        res.writeHead(405, { "Content-Type": 'text/plain; charset=UTF-8' });
        res.end('405 Method Not Allowed');
      }

    });
  });

};
