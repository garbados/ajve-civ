var common = require('./common');
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
        of: societies.map(function () { return 0; }),
        from: societies.map(function () { return 0; })
      }
    };
  });
}

function get_choice (turn, player, done) {
  if (turn % 10)
    player.turn(common.values.random(3, this.society), this.world, done);
  else
    player.inflection(common.values.highest(3, this.society), this.world, done);
}

function update_world (turn, choices, done) {
  if (turn % 10)
    this.ruleset.turn(choices, this.world, done);
  else
    this.ruleset.inflection(choices, this.world, done);
}

module.exports = play_game;
