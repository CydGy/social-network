var basic = require('basic');

var tos = {
  en: require('fs').readFileSync('../views/tos/en.html'),
  fr: require('fs').readFileSync('../views/tos/fr.html')
};


module.exports = function (req, res) {

  var lang = basic.getLang(req);
  var body = tos[lang] || tos.en;

  res.writeHead(200, {"Content-Type": 'text/html; charset=UTF-8'});
  res.end(body);

};
