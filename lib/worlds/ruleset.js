function RuleSet (opts) {
  this.turn = opts.turn;
  this.inflection = opts.inflection;
  if (opts.init) opts.init.call(this);
}

module.exports = RuleSet;
