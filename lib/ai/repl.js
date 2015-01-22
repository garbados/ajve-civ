var Player = require('./player');
var readline = require('readline');

module.exports = new Player({
  init: function () {
    this.make_rl = function (choices) {
      return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: function (line) {
          var hits = choices.filter(function (choice) { 
            return (choice.indexOf(line) === 0); 
          });
          return [hits, line];
        }
      });
    };

    this.ask = function ask (rl, choices, done) {
      rl.question(['Choose:', choices.join(', ')].join(' '), function (choice) {
        if (choices.indexOf(choice) !== -1)
          done(null, choice)
        else
          ask(done);
      });
    };
  },
  turn: function (choices, world, done) {
    var rl = this.make_rl(choices);
    console.log(JSON.stringify(world, undefined, 2));
    console.log('YOUR TURN');
    this.ask(rl, choices, done);
  },
  inflection: function (choices, world, done) {
    var rl = this.make_rl(choices);
    console.log(JSON.stringify(world, undefined, 2));
    console.log('INFLECTION TURN');
    this.ask(rl, choices, done);
  }
});