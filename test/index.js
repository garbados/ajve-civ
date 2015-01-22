var civ;
if (process.env.COVERAGE)
  cov = require('../cov-lib');
else
  cov = require('../lib');

describe('AjveCiv', function () {
  it.skip('should play a game with user input', function () { });
  it.skip('should play a game with default AI', function () { });
  it.skip('should play a game with custom AI', function () { });
  it.skip('should play a game with a custom ruleset', function () { });
});