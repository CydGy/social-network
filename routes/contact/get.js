var view = require('../../views/contact/contact.js');



module.exports = function (req, res, fields, checks, success) {

  res.statusCode = fields && 400 || 200;

  fields = fields || {};
  checks = checks || {};

  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.end(view(req, fields, checks, success));

};
