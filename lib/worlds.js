var worlds = {
  original: new RuleSet ({
    turn: original_turn,
    inflection: original_inflection
  }),
  extend: function (opts) {
    return new RuleSet(opts);
  }
};

function RuleSet (opts) {
  this.turn = opts.turn;
  this.inflection = opts.inflection;
}

function original_turn (choices, world, done) {
  // TODO
}

function original_inflection (choices, world, done) {
  // TODO
}

module.exports = worlds;
