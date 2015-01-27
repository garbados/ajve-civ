var Player = require('./player');
var repl = require('./repl');
var priority = require('./priority');

var players = {
  Player: Player,
  repl: repl,
  priority: priority,
  basic: priority.combinations(1),
  basic2: priority.combinations(2),
  basic3: priority.combinations(3),
  extend: function (opts) {
    return new Player(opts);
  }
};

module.exports = players;
