var Player = require('./player');
var repl = require('./repl');
var basic = require('./basic');

var players = {
  Player: Player,
  repl: repl,
  basic: basic,
  extend: function (opts) {
    return new Player(opts);
  }
};

module.exports = players;
