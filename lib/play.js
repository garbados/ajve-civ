var async = require('async');

function play_game (ruleset, game, done) {
  var teams = game;
  var players = get_players(teams);
  var societies = get_societies(teams);
  var world = {
    yield: 20,
    societies: societies
  };

  async.timesSeries(100, function (n, done) {
    async.waterfall([
      // get the choices of every player
      function (done) {
        var tasks = players.map(function (player, i) {
          return async.apply(get_choice.bind({
            world: world,
            society: societies[i]
          }), n, player);
        });
        async.parallel(tasks, done);
      },
      // have the ruleset apply those choices
      function (choices, done) {
        update_world.call({
          ruleset: ruleset,
          world: world
        }, n, choices, done);
      }
    ], function (err, new_world) {
      world = new_world;
      done(err);
    });
  }, done);
}

function get_players (teams) {
  return [].concat.apply([], teams);
}

function get_societies (teams) {
  return get_players(teams).map(function (player) {
    return {
      values: {
        discover: 2,
        conquer: 2,
        expand: 2,
        exchange: 2,
        consent: 2,
        develop: 2
      },
      nation: {
        population: 3,
        yield: 3
      },
      dispositions: {
        of: [],
        from: []
      }
    };
  });
}

function get_choice (turn, player, done) {
  if (turn % 10)
    player.turn(random_choices(this.society), this.world, done);
  else
    player.inflection(highest_values(this.society), this.world, done);
}

function update_world (turn, choices, done) {
  if (turn % 10)
    this.ruleset.turn(choices, this.world, done);
  else
    this.ruleset.inflection(choices, this.world, done);
}

function random_choices (society) {
  function shuffle (o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  var values = Object.keys(society.values);
  var choices = [];
  for (i = 0; i < 3; i++) {
    choices.push(values.pop());
    values = shuffle(values);
  }
  return choices;
}

function highest_values (society) {
  return Object.keys(society.values)
  .sort(function (value1, value2) {
    return society[value1] > society[value2] ? value1 : value2;
  })
  .slice(0, 3);
}

module.exports = play_game;
