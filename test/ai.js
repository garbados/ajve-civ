var chai = require('chai');
var async = require('async');
var ai;
if (process.env.COVERAGE)
  ai = require('../cov-lib/ai');
else
  ai = require('../lib/ai');

describe('ai', function () {
  describe('player', function () {
    it('should create a player object', function () {
      var player = ai.extend({
        turn: function () {},
        inflection: function () {},
        init: function () {},
      });
      chai.expect(player).to.be.instanceof(ai.Player);
    });
  });
  describe('basic', function () {
    it('should take choices and return a decision (turn)', function (done) {
      var choices = ['conquer', 'discover', 'exchange', 'expand', 'develop', 'consent'];
      var players = choices.map(function (value) { return ai.basic[value]; });
      var world = {};

      async.map(players, function (player, done) {
        player.turn(choices, world, done);
      }, function (err, players_choices) {
        chai.expect(players_choices).to.deep.equal(choices);
        done();
      });
    });
    it('should take choices and return a decision (inflection)', function (done) {
      var choices = ['conquer', 'discover', 'exchange', 'expand', 'develop', 'consent'];
      var players = choices.map(function (value) { return ai.basic[value]; });
      var world = {};

      async.map(players, function (player, done) {
        player.inflection(choices, world, done);
      }, function (err, players_choices) {
        chai.expect(players_choices).to.deep.equal(choices);
        done();
      });
    });
  });
  describe('repl', function () {

  });
});