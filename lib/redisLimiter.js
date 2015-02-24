var redis = require('redis');

var client = redis.createClient('/tmp/redis.sock', null, {
  parser: 'hiredis'
});

client.on('error', function (err) {
  console.error('redisLimiter got an error: ' + err);
});


function getKey (options) {
  return 'limiter:' + options.action + ':' + options.identifier;
}


/**
 * @param {Object} options
 *        {String} options.action
 *        {String} options.identifier
 *        {Number} options.limit
 *        {Boolean} [options.nonBlocking]
 */

exports.check = function (options, callback) {

  if (!options.action) return callback(new Error('action required'));
  if (!options.identifier) return callback(new Error('identifier required'));
  if (!options.limit) return callback(new Error('limit required'));

  var key = getKey(options);

  if (!client.connected && options.nonBlocking) return callback(null, false);

  client.get(key, function (err, reply) {
    if (err) return callback(err);
    
    callback(null, reply >= options.limit);

  });

};


/**
 * @param {Object} options
 *        {String} options.action
 *        {Number} options.limit
 *        {Boolean} [options.nonBlocking]
 */

exports.globalCheck = function (options, callback) {

  if (!options.action) return callback(new Error('action required'));
  if (!options.limit) return callback(new Error('limit required'));

  options.identifier = '*';
  var patternKey = getKey(options);

  if (!client.connected && options.nonBlocking) return callback(null, false);

  client.keys(patternKey, function (err, results) {
    if (err) return callback(err);

    callback(null, results.length >= options.limit);

  });

};


/**
 * @param {Object} options
 *        {String} options.action
 *        {String} options.identifier
 *        {Number} options.during - in seconds
 *        {Boolean} [options.nonBlocking]
 */

exports.incr = function (options, callback) {

  if (!options.action) return callback(new Error('action required'));
  if (!options.identifier) return callback(new Error('identifier required'));
  if (!options.during) return callback(new Error('during required'));

  var key = getKey(options);

  if (!client.connected && options.nonBlocking) return callback();

  client.incr(key, function (err, reply) {
    if (err) return callback(err);

    if (reply == 1) {

      if (!client.connected && options.nonBlocking) return callback();

      client.expire(key, options.during, function (err) {
        if (err) return callback(err);
        callback();
      });

    } else callback();

  });

};
