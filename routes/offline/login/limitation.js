var redisLimiter = require('../../../lib/redisLimiter.js');
var server_status = require('../../../server/server.js').server_status;


module.exports = function (remoteip, callback) {

  redisLimiter.check({
    action: 'login',
    identifier: remoteip,
    limit: 5,
    nonBlocking: true
  }, function (err, isPersoLimited) {
    if (err) return callback(err);

    redisLimiter.globalCheck({
      action: 'login',
      limit: server_status.login.globalLimitCount,
      nonBlocking: true
    }, function (err, isGloballyLimited) {
      if (err) return callback(err);

      var isLimited = isPersoLimited || isGloballyLimited;
      if (!server_status.login.recaptchaOn) isLimited = false;

      callback(null, isLimited);

    });
  });

};

