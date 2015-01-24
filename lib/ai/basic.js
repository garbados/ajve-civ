var Player = require('./player');

var VALUES = ['conquer', 'discover', 'exchange', 'expand', 'develop', 'consent'];

function basic_ai_init (value) {
  return function () {
    this.value = value;
  };
}

function basic_ai_choice (choices, world, done) {
  if (choices.indexOf(this.value) > -1)
    done(null, this.value);
  else
    done(null, choices[0]);
}

function make_basic_ai (value) {
  return new Player({
    init: basic_ai_init(value),
    turn: basic_ai_choice,
    inflection: basic_ai_choice
  });
}

var basic_ai = {};
VALUES.forEach(function (value) {
  basic_ai[value] = make_basic_ai(value);
});

module.exports = basic_ai;
