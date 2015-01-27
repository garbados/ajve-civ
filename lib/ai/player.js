function Player (opts) {
  this.name = opts.name;
  this.turn = opts.turn.bind(this);
  this.inflection = opts.inflection.bind(this);
  if (opts.init) opts.init.call(this);
}

module.exports = Player;
