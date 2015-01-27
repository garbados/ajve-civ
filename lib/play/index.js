var util = require('./util');
var common = require('../common');
var async = require('async');
var clone = require('clone');

function range (a, b) {
  if (a && !b) { b = a; a = 0; }
  return Array.apply(null, Array(b)).map(function (_, i) {return i;}).slice(a);
}

function turn (ruleset, players, world, done) {
  async.times(players.length, function (i, done) {
    var player = players[i];
    var society = world.societies[i];
    player.ai.turn.call(player.ai, common.values.random(3, society), i, world, done);
  }, function (err, choices) {
    if (err) return done(err);
    ruleset.turn(choices, world, done);
  });
}

function inflection (ruleset, players, world, done) {
  async.times(players.length, function (i, done) {
    var player = players[i];
    var society = world.societies[i];
    player.ai.inflection.call(player.ai, common.values.highest(3, society), i, world, done);
  }, function (err, choices) {
    if (err) return done(err);
    ruleset.inflection(choices, world, done);
  });
}

function Game (opts) {
  this.teams = opts.teams;
  this.ruleset = opts.ruleset;
  this.duration = opts.duration || 100;
  this.has_inflections = opts.inflections || true;

  this.players = util.get.players(this.teams);
  this.world = util.get.world(this.players);
}

Game.prototype.play = function (done) {
  var self = this;
  var history = [self.world];
  var each_inflection = async.apply(inflection, self.ruleset, self.players);
  var each_turn = async.apply(turn, self.ruleset, self.players);

  async.timesSeries(this.duration, function (n, done) {
    var world = history.slice(-1)[0];
    var task = (n % 10) ? each_turn : each_inflection;
    task(world, function (err, new_world) {
      if (err) return done(err);
      history.push(new_world);
      done();
    });
  }, function (err) {
    if (err) 
      return done(err);
    else
      done(null, {
        players: self.players,
        history: history
      });
  });
};

module.exports = function (opts, done) {
  var game = new Game(opts);
  game.play(done);
};
