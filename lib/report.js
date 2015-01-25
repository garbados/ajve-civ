function prettyprint (games) {
  var indent = '  ',
      jndent = '    ',
      kndent = '      ';
  games.forEach(function (turns, i) {
    console.log('game', i + 1);
    turns.forEach(function (world, j) {
      if (!((j === 0) || (j === (turns.length - 1)))) return;
      console.log(indent, 'turn', j + 1);
      console.log(jndent, 'global yield', world.yield);
      console.log(jndent, 'global feels', JSON.stringify(world.feels));
      world.societies.forEach(function (society, k) {
        console.log(jndent, 'society', society.name || k + 1);
        console.log(kndent, 'nation', JSON.stringify(society.nation));
        console.log(kndent, 'values', JSON.stringify(society.values));
      });
    });
    // BUT WHO WON?
    var last_turn = turns.slice(-1)[0];
    console.log(indent, 'final scores');
    var scores = last_turn.societies.map(function (society) {
      return society.nation.yield + society.nation.population;
    });
    var high_score = Math.max.apply(Math, scores);
    scores.forEach(function (score, i) {
      var WINNER = (score === high_score) && 'WINNER';
      var DEAD = (last_turn.societies[i]._dead) && 'DEAD';
      console.log(jndent, i + 1, score, DEAD || WINNER || '');
    });
    var total = scores.reduce(function (a, b) {
      return a + b;
    }, 0);
    console.log(indent, 'total score', total);
  });
}

function to_file (path) {
  return function (games) {
    fs.writeFileSync(path, JSON.stringify(games));
  };
}

function to_json () {
  return function (games) {
    console.log(JSON.stringify(games));
  };
}

module.exports = {
  prettyprint: prettyprint,
  to_file: to_file,
  to_json: to_json
};
