var redisLimiter = require('../../../lib/redisLimiter.js');
var server_status = require('../../../server/server.js').server_status;


module.exports = function (remoteip, callback) {

  redisLimiter.check({
    action: 'signup',
    identifier: remoteip,
    limit: 2,
    nonBlocking: true
  }, function (err, isPersoLimited) {
    if (err) return callback(err);

    redisLimiter.globalCheck({
      action: 'signup',
      limit: 2,
      nonBlocking: true
    }, function (err, isGloballyLimited) {
      if (err) return callback(err);

      var isLimited = isPersoLimited || isGloballyLimited;
      if (!server_status.signup.recaptchaOn) isLimited = false;

      callback(null, isLimited);

    });
  });

};
