var worlds = {
  original: original_ruleset,
  extend: function (opts) {
    return new RuleSet(opts);
  }
};

function RuleSet (opts) {
  this.turn = opts.turn;
  this.inflection = opts.inflection;
}

var original_ruleset = new RuleSet({
  turn: function (choices, world, done) {
    choices.forEach(function (choice, i) {
      var society = worlds.societies[i];
    });
  },
  inflection: function (choices, world, done) { /* TODO */ },
  init: function () { /* TODO */ }
});

module.exports = worlds;
