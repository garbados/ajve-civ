var chai = require('chai');
var async = require('async');
var clone = require('clone');
var worlds;
if (process.env.COVERAGE)
  worlds = require('../cov-lib/worlds');
else
  worlds = require('../lib/worlds');

var WORLD = {
  yield: 3,
  societies: [
    {
      values: {
        conquer: 2,
        expand: 2,
        exchange: 2,
        discover: 2,
        develop: 2,
        consent: 2
      },
      nation: {
        yield: 3,
        population: 3
      },
      dispositions: {
        of: [0, 0, 0],
        from: [0, 0, 0],
      }
    }, {
      values: {
        conquer: 2,
        expand: 2,
        exchange: 2,
        discover: 2,
        develop: 2,
        consent: 2
      },
      nation: {
        yield: 3,
        population: 3
      },
      dispositions: {
        of: [0, 0, 0],
        from: [0, 0, 0],
      }
    }, {
      values: {
        conquer: 2,
        expand: 2,
        exchange: 2,
        discover: 2,
        develop: 2,
        consent: 2
      },
      nation: {
        yield: 3,
        population: 3
      },
      dispositions: {
        of: [0, 0, 0],
        from: [0, 0, 0],
      }
    }
  ]
};

describe('worlds', function () {
  describe('original', function () {
    var original = worlds.original;
    describe('consequences', function () {
      beforeEach(function () {
        this.world = clone(WORLD);
      });
      it('develop raises local yield and lowers global yield', function (done) {
        var self = this;
        original.turn(['develop'], this.world, function (err, world) {
          if (err) return done(err);
          chai.expect(world.yield).to.be.below(self.world.yield);
          chai.expect(world.societies[0].nation.yield)
          .to.be.above(self.world.societies[0].nation.yield);
          done();
        });
      });
      it('consent raises global yield and improves global dispositions', function () {
        var self = this;
        original.turn(['consent'], this.world, function (err, world) {
          if (err) return done(err);
          chai.expect(world.yield).to.be.above(self.world.yield);
          world.societies[0].dispositions.from.forEach(function (disposition, i) {
            chai.expect(disposition).to.be.above(0);
          });
          world.societies.slice(1).forEach(function (society) {
            chai.expect(society.dispositions.of[0]).to.be.above(0);
          });
        });
      });
      it('expand grows population, but not above yield', function (done) {
        var self = this;
        async.waterfall([
          original.turn.bind(original, ['expand'], this.world),
          original.turn.bind(original, ['expand'])
        ], function (err, world) {
          if (err) return done(err);
          chai.expect(world.societies[0].nation.population)
          .to.be.above(self.world.societies[0].nation.population);
          chai.expect(world.societies[0].nation.population)
          .to.be.at.most(world.yield + world.societies[0].nation.yield);
          done();
        });
      });
      it('discover raises local yield', function (done) {
        var self = this;
        original.turn(['discover'], this.world, function (err, world) {
          if (err) return done(err);
          chai.expect(world.societies[0].nation.yield)
          .to.be.above(self.world.societies[0].nation.yield);
          done();
        });
      });
      it('exchange raises local yield and one foreign yield and disposition', function (done) {
        var self = this;
        original.turn(['exchange'], this.world, function (err, world) {
          if (err) return done(err);
          chai.expect(world.societies[0].nation.yield)
          .to.be.above(self.world.societies[0].nation.yield);
          chai.expect(world.societies[1].nation.yield + world.societies[2].nation.yield)
          .to.be.above(self.world.societies[1].nation.yield + self.world.societies[2].nation.yield);
          done();
        });
      });
      it('conquer raises local yield, lowers one foreign yield, and causes global dislike', function (done) {
        var self = this;
        original.turn(['conquer'], this.world, function (err, world) {
          if (err) return done(err);
          // one yield up, another down
          chai.expect(world.societies[0].nation.yield)
          .to.be.above(self.world.societies[0].nation.yield);
          chai.expect(world.societies[1].nation.yield + world.societies[2].nation.yield)
          .to.be.below(self.world.societies[1].nation.yield + self.world.societies[2].nation.yield);
          // global disposition ramifications
          world.societies[0].dispositions.from.forEach(function (disposition, i) {
            if (i !== 0) chai.expect([-1, -5]).to.contain(disposition);
          });
          world.societies.slice(1).forEach(function (society) {
            chai.expect([-1, -5]).to.contain(society.dispositions.of[0]);
          });

          done();
        });
      });
    });
    describe('turn', function () {
      beforeEach(function () {
        this.world = clone(WORLD);
      });
      it('handles multiple choices', function (done) {
        var self = this;
        original.turn(['consent', 'discover', 'expand'], this.world, function (err, world) {
          if (err) return done(err);

          world.societies[0].dispositions.from.forEach(function (disposition) {
            chai.expect(disposition).to.be.above(0);
          });
          chai.expect(world.yield).to.be.above(self.world.yield);
          chai.expect(world.societies[1].nation.yield)
          .to.be.above(self.world.societies[1].nation.yield);
          chai.expect(world.societies[2].nation.population)
          .to.be.above(self.world.societies[2].nation.population);

          done();
        });
      });
    });
    describe('inflection', function () {
      beforeEach(function () {
        this.world = clone(WORLD);
      });
      it('inspires ethical articulation', function (done) {
        var self = this;
        original.inflection(['discover'], this.world, function (err, world) {
          if (err) return done(err);
          var values = world.societies[0].values;
          Object.keys(values).forEach(function (value) {
            chai.expect([1, 2, 3]).to.contain(values[value]);
          });
          done();
        });
      });
    });
  });
});
