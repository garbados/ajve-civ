var RuleSet = require('./ruleset');
var common = require('../common');
var async = require('async');

var OriginalRules = new RuleSet({
  turn: function (choices, world, done) {
    var self = this;
    var tasks = choices.map(function (choice, i) {
      var society = world.societies[i];

      if (i === 0)
        return self.consequences[choice].bind(null, i, world);
      else
        return self.consequences[choice].bind(null, i);
    });

    async.seq(tasks, done);
  },
  inflection: function (choices, world, done) {
    choices.forEach(function (choice, i) {
      var society = worlds.societies[i];
      var highest = common.values.highest(3, society);

      highest.forEach(function (value) {
        if (value === choice)
          world.societies[i].values[value] += 2;
        else
          world.societies[i].values[value] += -1;
      });
    });

    done(null, world);
  },
  init: function () {
    this.consequences = consequences;
  }
});

var consequences = {
  conquer: function (i, world, done) {
    var society = world.societies[i];
    var others = society.dispositions.of;
    var j = others.indexOf(Math.min.apply(Math, others));
    
    society.values.conquer++;
    var conquer = society.values.conquer;
    world.societies[i].nation.yield += conquer;
    world.societies[j].nation.yield += -conquer;

    world.societies = world.societies.map(function (society, k) {
      if (k === j)
        society.dispositions.of[i] += -5;
      else if (k !== i)
        society.dispositions.of[i] += -1;
      return society;
    });

    done(null, world);
  },
  exchange: function (i, world, done) {
    var society = world.societies[i];
    var others = society.dispositions.of;
    var j = others.indexOf(Math.max.apply(Math, others));
    var bestie = world.societies[j];

    society.values.exchange++;
    bestie.dispositions.of[i]++;
    society.nation.yield += society.values.exchange;
    bestie.nation.yield += bestie.values.exchange;
    world.societies[i] = society;
    world.societies[j] = bestie;

    done(null, world);
  },
  discover: function (i, world, done) {
    var society = world.societies[i];
    society.values.discover++;
    society.nation.yield += society.values.discover;
    world.societies[i] = society;
    done(null, world);
  },
  expand: function (i, world, done) {
    var society = world.societies[i];
    society.values.expand++;
    society.nation.yield += society.values.expand;
    world.societies[i] = society;
    done(null, world);
  },
  develop: function (i, world, done) {
    var society = world.societies[i];
    society.values.develop++;
    society.nation.yield += 3 * discover;
    world.yield += -society.values.develop;
    world.societies[i] = society;
    done(null, world);
  },
  consent: function (i, world, done) {
    // restores the world
    // TODO reason out better
    var consent = world.societies[i].values.consent;
    world.yield += consent;
    world.societies = world.societies.map(function (society, j) {
      if (i !== j)
        society.dispositions.of[i] += consent;
      return society;
    });
    done(null, world);
  }
};

module.exports = OriginalRules;
