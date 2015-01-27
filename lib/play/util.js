function get_player (ai, team) {
  return {
    team: team,
    ai: ai,
    name: ai.name
  };
}

function get_players (teams) {
  var players = [];
  var n_teams = 0;
  
  teams.forEach(function (team) {
    n_teams += 1;
    if (team.length)
      team.forEach(function (ai) { players.push(get_player(ai, n_teams)); });
    else
      players.push(get_player(team, n_teams));
  });

  return players;
}

function get_society () {
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
    }
  };
}

function get_world (players) {
  return {
    yield: 20,
    feels: feels_matrix(players),
    societies: players.map(get_society)
  };
}

function get_societies (players) {
  return players.map(get_society);
}

function feels_matrix (players) {
  var feels = [];
  for(var i = 0; i < players.length; i++) {
    feels[i] = [];
    for (var j = 0; j < players.length; j++) {
      feels[i][j] = 0;
    }
  }
  return feels;
}

module.exports = {
  get: {
    players: get_players,
    societies: get_societies,
    feels: feels_matrix,
    world: get_world
  }
};
