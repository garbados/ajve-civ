#!/usr/bin/env node

var pjson = require('../package.json');
var civ = require('..');
var argv = require('commander')
   .version(pjson.version)
   .option('-r, --report <type>', 'specify report format: \'json\' or a filepath')
   .option('-p, --players <list>', 'specify which AI should play, ex: -p repl,basic.discover')
   .option('-d, --duration <number>', 'specify how long the game should be')
   .option('-i, --no-inflections', 'turn off inflections, if that\'s your thing')
   .parse(process.argv);

var players;
if (argv.players) {
  players = argv.players.split(',')
  .filter(function (str) {
    return !!str;
  })
  .map(function (player_str) {
    if (player_str in civ.ai) {
      if (!civ.ai[player_str].turn) {
        return Object.keys(civ.ai[player_str]).map(function (value) {
          return civ.ai[player_str][value];
        });
      } else {
        return civ.ai[player_str];
      }
    } else if (player_str.indexOf('.') > -1) {
      var path = player_str.split('.');
      return civ.ai[path[0]][path[1]];
    }
  });
} else {
  players = [
    civ.ai.repl,
    civ.ai.basic.consent,
    civ.ai.basic.conquer,
    civ.ai.basic.develop,
    civ.ai.basic.discover,
    civ.ai.basic.exchange,
    civ.ai.basic.expand
  ];
}

civ
.game.apply(civ, players)
.play({
  duration: argv.duration || 100,
  has_inflections: !argv['no-inflections'],
})
.report(argv.report);
