var view = require('../../../views/report.js');


module.exports = function (req, res, photoId) {

  res.writeHead(200, {"Content-Type": 'text/html; charset=UTF8'});
  res.end(view(photoId));

};
