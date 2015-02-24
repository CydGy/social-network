var view = require('../../../views/offline/signup/signup.js');
var limitation = require('./limitation.js');
var basic = require('basic');



module.exports = function (req, res, fields, checks) {

  res.statusCode = fields && 400 || 200;

  fields = fields || {};
  checks = checks || {};

  limitation(req.connection.remoteip, function (err, isLimited) {
    if (err) return basic.reserr(res, err);

    checks.isLimited = isLimited;

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.end(view(req, fields, checks));

  });

};
