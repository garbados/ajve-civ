var players = {
  repl: repl_player,
  basic: {
    conquer: new Player({
      turn: function (choices, world, done) {
        // TODO
      },
      inflection: function (choices, world, done) {
        // TODO
      },
      init: function () {
        // TODO
      }
    }),
    discover: new Player({
      turn: function (choices, world, done) {
        // TODO
      },
      inflection: function (choices, world, done) {
        // TODO
      },
      init: function () {
        // TODO
      }
    }),
    exchange: new Player({
      turn: function (choices, world, done) {
        // TODO
      },
      inflection: function (choices, world, done) {
        // TODO
      },
      init: function () {
        // TODO
      }
    }),
    expand: new Player({
      turn: function (choices, world, done) {
        // TODO
      },
      inflection: function (choices, world, done) {
        // TODO
      },
      init: function () {
        // TODO
      }
    }),
    develop: new Player({
      turn: function (choices, world, done) {
        // TODO
      },
      inflection: function (choices, world, done) {
        // TODO
      },
      init: function () {
        // TODO
      }
    }),
    consent: new Player({
      turn: function (choices, world, done) {
        // TODO
      },
      inflection: function (choices, world, done) {
        // TODO
      },
      init: function () {
        // TODO
      }
    })
  },
  extend: function (opts) {
    return new Player(opts);
  }
};

function Player (opts) {
  this.turn = opts.turn.bind(this);
  this.inflection = opts.inflection.bind(this);
  if (opts.init) opts.init.call(this);
}

var repl_player = {
  turn: function (choices, world, done) {
    // TODO
  },
  inflection: function (choices, world, done) {
    // TODO
  },
  init: function () {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
};

module.exports = players;
