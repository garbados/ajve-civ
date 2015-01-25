var RuleSet = require('./ruleset');
var common = require('../common');
var async = require('async');
var clone = require('clone');

var consequences = {
  conquer: function (i, world, done) {
    if (world.societies.length < 2) {
      return done(null, world);
    }

    var society = world.societies[i];
    var others = clone(society.dispositions.of);
    others[i] = Infinity;
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
      else
        society.dispositions.from = society.dispositions.from.map(function (disposition, l) {
          if (l !== i && l !== j)
            return disposition - 1;
          else if (l === j)
            return disposition - 5;
          else
            return disposition;
        });
      return society;
    });

    done(null, world);
  },
  exchange: function (i, world, done) {
    if (world.societies.length < 2)
      return done(null, world);

    var society = world.societies[i];
    society.values.exchange++;
    society.nation.yield += society.values.exchange;
    world.societies[i] = society;
    
    var others = clone(world.societies[i].dispositions.of);
    others[i] = -Infinity;
    var j = others.indexOf(Math.max.apply(Math, others));
    var bestie = world.societies[j]; 
    bestie.dispositions.of[i]++;
    bestie.nation.yield += bestie.values.exchange;
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
    society.nation.population += society.values.expand;
    world.societies[i] = society;
    done(null, world);
  },
  develop: function (i, world, done) {
    var society = world.societies[i];
    society.values.develop++;
    society.nation.yield += 3 * society.values.develop;
    world.yield += -society.values.develop;
    world.societies[i] = society;
    var dispositions = clone(world.societies[0].dispositions);
    dispositions.from = dispositions.from.map(function (disposition, j) {
      if (i !== j)
        return disposition - 1;
      else
        return disposition;
    });
    world.societies[0].dispositions = dispositions;
    world.societies.forEach(function (society, j) {
      if (j !== i)
        world.societies[j].dispositions.of[i] += -1;
    });
    done(null, world);
  },
  consent: function (i, world, done) {
    // restores the world
    // TODO why does affirming consent restore the globe?
    var consent = world.societies[i].values.consent;
    world.yield += consent;
    world.societies = world.societies.map(function (society, j) {
      if (i !== j)
        society.dispositions.of[i] += consent;
      return society;
    });
    world.societies[0].dispositions.from = 
      world.societies[0].dispositions.from.map(function (disposition) {
        return disposition + consent;
      });

    done(null, world);
  }
};

var OriginalRules = new RuleSet({
  turn: function (choices, world, done) {
    var self = this;
    var tasks = choices.map(function (choice, i) {
      var society = world.societies[i];
      var _world = clone(world);

      if (society.nation.population < 0)
        // dead; do nothing
        return function (done, _) {
          (_ || done)(null, world);
        };
      else if (i === 0)
        return self.consequences[choice].bind(null, i, _world);
      else
        return self.consequences[choice].bind(null, i);
    });

    async.waterfall(tasks, function (err, world) {
      // population cleanup by global yield
      world.societies.forEach(function (society, i) {
        var total_yield = society.nation.yield + world.yield;
        society.nation.population = Math.min(society.nation.population, total_yield);
        world.societies[i] = society;
      });

      done(null, world);
    });
  },
  inflection: function (choices, world, done) {
    choices.forEach(function (choice, i) {
      var society = world.societies[i];
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

module.exports = OriginalRules;
