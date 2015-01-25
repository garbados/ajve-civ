#!/usr/bin/env node

var civ = require('..');
var yargs = require('yargs')
   .alias('r', 'report');
var argv = yargs.argv;

civ
.game([
  // civ.ai.repl,
  civ.ai.basic.conquer,
  civ.ai.basic.discover,
  civ.ai.basic.expand,
  civ.ai.basic.exchange,
  civ.ai.basic.develop,
  civ.ai.basic.consent,
])
.play()
.report(argv.report);
