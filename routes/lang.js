var valid = require('valid');
var basic = require('basic');
var view = require('../views/lang.js');


module.exports = function (req, res) {

  var currentLang = basic.getLang(req);

  if (valid.lang(req.urlparsed.query.lang)) {

    var cookie = 'lang=' + req.urlparsed.query.lang;

    res.statusCode = 302;
    res.setHeader('Set-Cookie', cookie);
    res.setHeader('Location', '/');
    res.end();

  } else {

    res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
    res.end(view(currentLang));

  }

};
