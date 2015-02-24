var Memcached = require('memcached');
var memcached = new Memcached('/tmp/memcached.sock', {});

memcached.on('issue', function (details) {
  console.log('Memcached issue');
  console.log(details);
});

memcached.on('failure', function (details) {
  console.log('Memcached failure');
  console.log(details);
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

  if (!memcached.connections['/tmp/memcached.sock'] && options.nonBlocking)
    return callback(null, false);

  memcached.get(key, function (err, data) {
    if (err) return callback(err);

    callback(null, data >= options.limit);

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

  if (!memcached.connections['/tmp/memcached.sock'] && options.nonBlocking)
    return callback();

  memcached.incr(key, 1, function (err, response) {
    if (err) return callback(err);

    if (response) callback();
    else {

      memcached.set(key, 1, options.during, function (err) {
        if (err) return callback(err);
        callback();
      });

    }

  });

};
