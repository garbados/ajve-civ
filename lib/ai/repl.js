var Player = require('./player');
var readline = require('readline');

module.exports = new Player({
  init: function () {
    this._turn = 0;
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
      rl.prompt();
      rl.on('line', function (choice) {
        if (choices.indexOf(choice) !== -1) {
          rl.close();
          done(null, choice); 
        }
        else
          ask(rl, choices, done);
      });
    };
  },
  turn: function (choices, i, world, done) {
    this._turn++;
    var society = world.societies[i];
    if (society._dead)
      return done(null, world);
    var rl = this.make_rl(choices);
    var indent = '  ',
        kndent = '    ';
    console.log('TURN', this._turn);
    console.log(indent, 'yield', world.yield);
    console.log(indent, 'feels', JSON.stringify(world.feels));
    world.societies.forEach(function (society, i) {
      console.log(indent, 'society', i);
      console.log(kndent, 'yield', society.nation.yield);
      console.log(kndent, 'population', society.nation.population);
      console.log(kndent, 'values', JSON.stringify(society.values));
    });
    console.log('CHOOSE', choices.join(' or '));
    this.ask(rl, choices, done);
  },
  inflection: function (choices, i, world, done) {
    var society = world.societies[i];
    if (society._dead)
      return done(null, world);
    this._turn++;
    var rl = this.make_rl(choices);
    var indent = '  ',
        kndent = '    ';
    console.log('TURN', this._turn, '-- INFLECTION');
    console.log(indent, 'yield', world.yield);
    console.log(indent, 'feels', JSON.stringify(world.feels));
    world.societies.forEach(function (society, i) {
      console.log(indent, 'society', i);
      console.log(kndent, 'yield', society.nation.yield);
      console.log(kndent, 'population', society.nation.population);
      console.log(kndent, 'values', JSON.stringify(society.values));
    });
    console.log('CHOOSE', choices.join(' or '));
    this.ask(rl, choices, done);
  }
});
