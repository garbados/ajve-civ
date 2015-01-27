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
    var j = this.feels.min(world, i);
    
    society.values.conquer++;
    var conquer = society.values.conquer;
    world.societies[i].nation.yield += conquer;
    world.societies[j].nation.yield += -conquer;

    world.feels.forEach(function (feels, k) {
      if (k === i)
        // skip; do nothing
        return;
      else if (k === j)
        world.feels[k][i] += -5;
      else
        world.feels[k][i] += -1;
    });

    done(null, world);
  },
  exchange: function (i, world, done) {
    if (world.societies.length < 2)
      return done(null, world);

    var society = world.societies[i];
    var j = this.feels.max(world, i);
    var bestie = world.societies[j]; 

    world.societies[i].values.exchange++;
    world.societies[i].nation.yield += society.values.exchange;
    world.societies[j].nation.yield += bestie.values.exchange;

    world.feels[i][j] += 1;
    world.feels[j][i] += 1;

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
    society.nation.yield += 2 * society.values.develop;
    world.yield += -society.values.develop;
    world.societies[i] = society;
    world.feels.forEach(function (feel, j) {
      if (j !== i)
        world.feels[j][i] += -1;
    });
    done(null, world);
  },
  consent: function (i, world, done) {
    // restores the world
    // TODO why does affirming consent restore the globe?
    world.societies[i].values.consent++;
    var consent = world.societies[i].values.consent;
    world.yield += consent;
    world.feels.forEach(function (feel, j) {
      if (j !== i)
        world.feels[j][i] += consent;
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

      if (society._dead)
        // dead; do nothing
        return function (done, _) {
          if (typeof done === 'object')
            _(null, done); // _ = callback, done = world
          else
            done(null, world);
        };
      else if (i === 0)
        return self.consequences[choice].bind(self, i, _world);
      else
        return self.consequences[choice].bind(self, i);
    });

    async.waterfall(tasks, function (err, world) {
      // population cleanup by global yield
      world.societies
      .forEach(function (society, i) {
        var total_yield = society.nation.yield + world.yield;
        if (society.nation.population < 0) {
          society._dead = true;
        } else {
          society.nation.population = Math.min(society.nation.population, total_yield);
        }
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
    this.feels = {
      // returns the index of the player
      // you like the most
      max: function (world, i) {
        var feels = clone(world.feels);
        var max = 0;
        // TODO categorically eliminate possibility of choosing self
        feels[i].forEach(function (feel, j) {
          if ((max === i) && (j !== i))
            max = j;
          else if ((j !== i) && (feel >= feels[i][max]))
            max = j;
        });
        return max;
      },
      // returns the index of the player
      // you like the least
      min: function (world, i) {
        var feels = clone(world.feels);
        var min = 0;
        // TODO categorically eliminate possibility of choosing self
        feels[i].forEach(function (feel, j) {
          if ((min === i) && (j !== i))
            min = j;
          else if ((j !== i) && (feel <= feels[i][min]))
            min = j;
        });
        return min;
      }
    };
  }
});

module.exports = OriginalRules;
