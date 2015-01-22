function Player (opts) {
  this.turn = opts.turn.bind(this);
  this.inflection = opts.inflection.bind(this);
  if (opts.init) opts.init.call(this);
}

module.exports = Player;
