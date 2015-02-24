var basic = require('basic');

var about = {
  en: require('fs').readFileSync('../views/about/en.html'),
  fr: require('fs').readFileSync('../views/about/fr.html')
};


module.exports = function (req, res) {

  var lang = basic.getLang(req);
  var body = about[lang] || about.en;

  res.writeHead(200, {"Content-Type": 'text/html; charset=UTF-8'});
  res.end(body);

};
