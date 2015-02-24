var fs = require('fs');
var spawn = require('child_process').spawn;
var ObjectID = require('mongodb').ObjectID;
var PHOTOS_DIR = require('CONST').PHOTOS_DIR;

var util = require('util');
var logOn = true;


/**
 * @param {Object} opts
 *        {String} opts.path
 *        {ObjectID} opts.user_id
 *        {Array} [opts.sizes]
 */

function Photo (opts) {

  var opts = opts || {};
  this.sizes = opts.sizes || [];
  this.path = opts.path;
  this.user_id = opts.user_id;

  if (this.path && this.user_id)
    this.requiredData = true;

  this._id = new ObjectID();
  this.id = this._id.toHexString();
  this.dir1 = this.id.slice(-1) + '/';
  this.dir2 = this.id.slice(-2, -1) + '/';
  this.dir3 = this.id + '/';
  this.dirpath = PHOTOS_DIR + this.dir1 + this.dir2 + this.dir3;

  this.doc = {
    "_id": this._id,
    "user_id": this.user_id,
    "posted": new Date(),
    "likesCount": 0,
    "dislikesCount": 0,
    "scoreCount": 0,
    "path": '/photos/' + this.dir1 + this.dir2 + this.dir3
  };

}


Photo.prototype.check = function (callback) {

  if (this.isValid) return callback();
  if (!this.requiredData)
    return callback(new Error('required data are missing'));

  var self = this;

  var args = [
    '-format', '%m %wx%h',
    this.path
  ];

  var identify = spawn('identify', args);

  var data = '';
  identify.stdout.setEncoding('utf8');

  identify.stdout.on('data', function (chunk) {
    data += chunk;
  });

  identify.on('error', function (err) {
    callback(err);
  });

  identify.on('close', function (code) {
    
    if (code !== 0) {
      var err = new Error('identify process closed with code: ' + code);
      return callback(err);
    }

    //self.isValid = /^(JPEG|PNG) [0-9]+x[0-9]+$/.test(data);
    self.isValid = /^(JPEG|PNG) [0-9]+x[0-9]+/.test(data);

    if (logOn) {
      if (self.isValid) util.log('photo %s: Is valid.', self.id);
      else util.log('photo %s: Is invalid.', self.id);
    }

    callback();

  });

};


Photo.prototype.createDirs = function (callback) {

  if (this.dirsCreated) return callback();
  if (!this.requiredData)
    return callback(new Error('required data are missing'));

  var self = this;

  fs.mkdir(PHOTOS_DIR + self.dir1, function (err) {
    if (err && err.code !== 'EEXIST') return callback(err);
  fs.mkdir(PHOTOS_DIR + self.dir1 + self.dir2, function (err) {
    if (err && err.code !== 'EEXIST') return callback(err);
  fs.mkdir(PHOTOS_DIR + self.dir1 + self.dir2 + self.dir3, function (err) {
    if (err && err.code !== 'EEXIST') return callback(err);

    self.dirsCreated = true;
    if (logOn) util.log('photo %s: Directories created.', self.id);
    callback();

  }); }); });

};


Photo.prototype.removeOriginal = function (callback) {
  
  if (this.originalRemoved) return callback();
  if (!this.requiredData)
    return callback(new Error('required data are missing'));

  var self = this;

  fs.unlink(self.path, function (err) {
    if (err) return callback(err);

    self.path = null;
    self.originalRemoved = true;
    if (logOn) util.log('photo %s: Original removed.', self.id);
    callback();

  });

};


Photo.prototype.saveOriginal = function (callback) {

  if (this.originalSaved) return callback();
  if (!this.requiredData)
    return callback(new Error('required data are missing'));

  var self = this;

  this.createDirs(function (err) {
    if (err) return callback(err);

    var newPath = self.dirpath + 'original.jpg';
    
    fs.rename(self.path, newPath, function (err) {
      if (err) return callback(err);

      self.path = newPath;
      self.originalSaved = true;
      if (logOn) util.log('photo %s: Original saved.', self.id);
      callback();

    });

  });

};


Photo.prototype.resize = function (callback) {

  if (this.resized) return callback();
  if (!this.requiredData)
    return callback(new Error('required data are missing'));
  if (!this.sizes.length) return callback();

  var self = this;

  this.createDirs(function (err) {
    if (err) return callback(err);

    for (var i = 0, count = 0, c = self.sizes.length; i < c; i++) {
      (function (i) {

        var size = self.sizes[i];
        var newPath = self.dirpath + size + '.jpg';
        
        var args = [
          self.path,
          '-thumbnail', size + '^',
          '-gravity', 'Center',
          '-extent', size,
          '+repage',
          '-strip',
          '-quality', '92',
          '-format', 'JPEG',
          newPath
        ];

        var convert = spawn('convert', args);

        convert.on('error', function (err) {
          callback(err);
        });

        convert.on('close', function (code) {

          if (code !== 0) {
            var err = new Error('convert process closed with code: ' + code);
            return callback(err);
          }
          
          if (logOn) util.log('photo %s: Resized for ' + size + '.', self.id);

          if (++count === c) {
            self.resized = true;
            if (logOn) util.log('photo %s: Resized.', self.id);
            callback();
          }

        });

      })(i);
    }

  });

};


module.exports = Photo;
