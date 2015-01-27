var async = require('async');
var ai = require('./ai');
var worlds = require('./worlds');
var play = require('./play');
var async = require('async');
var common = require('./common');
var report = require('./report');
var q = require('q');

function AjveCiv () {
  this._world = worlds.original;
  this._games = [];
}

AjveCiv.prototype.common = common;

AjveCiv.prototype.ai = ai;

AjveCiv.prototype.worlds = worlds;

AjveCiv.prototype.world = function (world) {
  this._world = world;
  return this;
};

AjveCiv.prototype.play = function (opts) {
  var defer = q.defer();
  var self = this;

  async.mapSeries(this._games, function (teams, done) {
    play({
      teams: teams,
      ruleset: self._world,
      duration: (opts && opts.duration) || 100
    }, done);
  }, function (err, report) {
    if (err)
      defer.reject(err);
    else
      defer.resolve(report);
  });

  this._playing = defer.promise;
  return this;
};

AjveCiv.prototype.report = function (opts) {
  if (!this._playing) throw new Error("Must call `play()` before `report()`");

  if (typeof opts === 'string') {
    if (opts === 'json')
      this._playing = this._playing.then(report.to_json());
    else
      // file path 
      this._playing = this._playing.then(report.to_file(opts));
  }
  else if (typeof opts === 'function')
    // custom function
    this._playing = this._playing.then(opts);
  else if (opts === undefined)
    this._playing = this._playing.then(report.prettyprint);

  return this;
};

AjveCiv.prototype.game = function () {
  var args = Array.prototype.slice.call(arguments);
  this._games.push(args);
  return this;
};

module.exports = new AjveCiv();
