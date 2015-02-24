/**
 * fast bro'
 */

// TODO To secure (to join url)
// TODO To put linux rights for files
// TODO To read file as a stream an to pipe the response
// To benchmark because it seems that it is not really fast.
// And to put autoclose:false
// Imagine you've 50 users loading the same file. They will open
// it 50 times. It's better to open it one time and close it when
// it is finish.
// so to use fs.open and fs.read
// TODO to respond error and to check errors (for every file!)


var fs = require('fs');
var basic = require('basic');

var CONST = require('CONST');

// from /server.js
var files = {
  valid: fs.readFileSync('../node_modules/valid.js')
};


module.exports = function (req, res, type) {

  var pathname = req.urlparsed.pathname;

  if (type === 'js') {

    if (pathname === '/valid.js') {

      // modules
      res.writeHead(200, {"Content-Type": "text/javascript"});
      res.end(files.valid);

    } else {

      fs.readFile('../public/js' + pathname, function (err, data) {
        if (err) {
          if (err.code === 'ENOENT') return resNotFound();
          else return basic.reserr(res, err);
        }
        res.writeHead(200, {"Content-Type": "text/javascript"});
        res.end(data)
      });

    }

  }

  else if (type === 'css') {
    fs.readFile('../public/css' + pathname, function (err, data) {
      if (err) {
        if (err.code === 'ENOENT') return resNotFound();
        else return basic.reserr(res, err);
      }
      res.writeHead(200, {"Content-Type": "text/css"});
      res.end(data)
    });
  }

  else if (type === 'photos') {
    fs.readFile(CONST.PHOTOS_DIR + pathname.substring(8), function (err, data) {
      if (err) {
        if (err.code === 'ENOENT') return resNotFound();
        else return basic.reserr(res, err);
      }
      res.writeHead(200, {"Content-Type": "image/jpeg"});
      res.end(data)
    });
  }

  else if (type === 'img') {
    fs.readFile('../public/img' + pathname, function (err, data) {
      if (err) {
        if (err.code === 'ENOENT') return resNotFound();
        else return basic.reserr(res, err);
      }
      if (/\.gif$/.test(pathname)) res.writeHead(200, {"Content-Type": "image/gif"});
      else if (/\.jpg$/.test(pathname)) res.writeHead(200, {"Content-Type": "image/jpeg"});
      else if (/\.png$/.test(pathname)) res.writeHead(200, {"Content-Type": "image/png"});
      else if (/\.svg$/.test(pathname)) res.writeHead(200, {"Content-Type": "image/svg+xml"});
      res.end(data)
    });
  }

  function resNotFound() {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.end('404 Not Found');
  }

};
