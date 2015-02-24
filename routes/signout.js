var session = require('session');


module.exports = function (req, res) {

  var cookies = session.close(req.connection.remoteAddress);
  req.connection.user_id = null; // bug disconnect!

  res.statusCode = 302;
  res.setHeader('Set-Cookie', cookies);
  res.setHeader('Location', '/');
  res.end();

};
