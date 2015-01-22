var players = {
  repl: repl_player
  basic: {
    conquer:
    discover:
    exchange:
    
  },
  extend: function (opts) {
    return new Player(opts);
  }
};

function Player (opts) {
  this.turn = opts.turn;
  this.inflection = opts.inflection;
}

var repl_player = {
  turn: function (choices, world, done) {
    // TODO
  },
  inflection: function (choices, world, done) {
    // TODO
  }
};

module.exports = players;
