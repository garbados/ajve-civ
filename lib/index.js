var async = require('async');
var ai = require('./ai');
var worlds = require('./worlds');
var play = require('./play');
var async = require('async');
var common = require('./common');
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

  async.mapSeries(this._games, play.bind(null, this._world), function (err, report) {
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

  // TODO custom print options and stuff
  this._playing = this._playing.then(function (games) {
    console.log(games);
    var indent = '  ',
        jndent = '    ',
        kndent = '      ';
    games.forEach(function (turns, i) {
      console.log('game', i + 1);
      turns.forEach(function (world, j) {
        if (!((j === 0) || (j === (turns.length - 1)))) return;
        console.log(indent, 'turn', j + 1);
        console.log(jndent, 'global yield', world.yield);
        console.log(jndent, 'global feels', JSON.stringify(world.feels));
        world.societies.forEach(function (society, k) {
          console.log(jndent, 'society', society.name || k + 1);
          console.log(kndent, 'nation', JSON.stringify(society.nation));
          console.log(kndent, 'values', JSON.stringify(society.values));
        });
      });
    });
  });
  return this;
};

AjveCiv.prototype.game = function () {
  var args = Array.prototype.slice.call(arguments);
  this._games.push(args);
  return this;
};

module.exports = new AjveCiv();
