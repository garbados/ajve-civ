// quickly prototype AI that prioritize 
// multiple values in a given order

var Player = require('./player');
var priority = require('./priority');
var Combinatorics = require('js-combinatorics').Combinatorics;
var VALUES = ['conquer', 'discover', 'exchange', 'expand', 'develop', 'consent'];

function priority_choice (priorities, choices, done) {
  for (var i = 0; i < priorities.length; i++) {
    var priority = priorities[i];
    if (choices.indexOf(priority) > -1) {
      return done(null, priority);
    }
  }

  return done(null, choices[0]);
}

function make_priority_ai (priorities) {
  return new Player({
    name: priorities.join('-'),
    turn: function (choices, i, world, done) {
      this.choose(choices, done);
    },
    inflection: function (choices, i, world, done) {
      this.choose(choices, done);
    },
    init: function () {
      this.priorities = priorities;
      this.choose = priority_choice.bind(this, this.priorities);
    }
  });
}

function comb_priority_ai (n) {
  var result = {};
  var combinations = Combinatorics.combination(VALUES, n).toArray();
  combinations.forEach(function (priorities) {
    result[priorities.join('-')] = make_priority_ai(priorities);
  });
  return result;
}

exports.make = make_priority_ai;
exports.combinations = comb_priority_ai;
