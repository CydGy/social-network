var view = require('../../../views/account/send_password_reset/view.js');


module.exports = function (req, res) {

  res.writeHead(200, {"Content-Type": 'text/html; charset=UTF-8'});
  res.end(view());

};
