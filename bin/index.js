#!/usr/bin/env node

var civ = require('..');

civ
.game([
  // civ.ai.repl,
  civ.ai.basic.conquer,
  civ.ai.basic.discover,
  civ.ai.basic.expand,
  civ.ai.basic.exchange,
  civ.ai.basic.develop
])
.play({
  spectator: true
})
.report();
