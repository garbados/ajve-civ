var chai = require('chai');
var original = require('../lib/worlds/original');
var basic_ai = require('../lib/ai').basic;
var play;
if (process.env.COVERAGE)
  play = require('../cov-lib/play');
else
  play = require('../lib/play');

describe('play', function () {
  it('should play a game', function (done) {
    var players = Object.keys(basic_ai).map(function (name) {
      return basic_ai[name];
    });
    play({
      ruleset: original,
      teams: players
    }, function (err, results) {
      chai.expect(results.players.length).to.equal(players.length);
      var turns = results.history;
      var first_turn = turns[0];
      var last_turn = turns.slice(-1)[0];
      chai.expect(first_turn.yield).to.not.equal(last_turn.yield);
      done();
    });
  });
});
