#!/usr/bin/env node

var pjson = require('../package.json');
var civ = require('..');
var argv = require('commander')
   .version(pjson.version)
   .option('-r, --report', 'specify report format: \'json\' or a filepath')
   .option('-p, --players [list]', 'specify which AI should play, ex: -p repl,basic.discover')
   .parse(process.argv);

var players;
if (argv.players) {
  players = argv.players.split(',').map(function (player_str) {
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
  players = Object.keys(civ.ai.basic).map(function (value) {
    return civ.ai.basic[value];
  });
}

civ
.game(players)
.play()
.report(argv.report);
