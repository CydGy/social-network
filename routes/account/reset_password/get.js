var view = require('../../../views/account/reset_password/view.js');


module.exports = function (req, res) {

  res.writeHead(200, {"Content-Type": 'text/html; charset=UTF-8'});
  res.end(view(req.urlparsed));

};
