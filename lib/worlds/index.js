var RuleSet = require('./ruleset');
var OriginalRules = require('./original');

var worlds = {
  original: OriginalRules,
  extend: function (opts) {
    return new RuleSet(opts);
  }
};

module.exports = worlds;
