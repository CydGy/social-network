var basic = require('basic');

var privacy = {
  en: require('fs').readFileSync('../views/privacy/en.html'),
  fr: require('fs').readFileSync('../views/privacy/fr.html')
};


module.exports = function (req, res) {

  var lang = basic.getLang(req);
  var body = privacy[lang] || privacy.en;

  res.writeHead(200, {"Content-Type": 'text/html; charset=UTF-8'});
  res.end(body);

};

