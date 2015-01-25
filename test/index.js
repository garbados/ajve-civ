var civ;
if (process.env.COVERAGE)
  civ = require('../cov-lib');
else
  civ = require('../lib');

describe('AjveCiv', function () {
  it.skip('should play a game with user input', function () { });
  it('should play a game with default AI', function (done) {
    var players = Object.keys(civ.ai.basic).map(function (key) {
      return civ.ai.basic[key];
    });
    civ
    .game(players)
    .play()
    ._playing
    .then(function () {
      done();
    })
    .fail(done);
  });
  it.skip('should play a game with custom AI', function () { });
  it.skip('should play a game with a custom ruleset', function () { });
});