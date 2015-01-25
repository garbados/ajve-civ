var chai = require('chai');
var async = require('async');
var clone = require('clone');
var worlds;
if (process.env.COVERAGE)
  worlds = require('../cov-lib/worlds');
else
  worlds = require('../lib/worlds');

describe('worlds', function () {
  describe('original', function () {
    var original = worlds.original;
    describe('consequences', function () {
      beforeEach(function () {
        this.world = {
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
      it.skip('consent raises global yield and improves global dispositions', function () {

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
      it.skip('exchange raises local yield and one foreign yield and disposition', function () {

      });
      it.skip('conquer raises local yield, lowers one foreign yield, and causes global dislike', function () {

      });
    });
    describe('turn', function () {
      it.skip('handles multiple choices', function () {

      });
    });
    describe('inflection', function () {
      it.skip('inspires ethical articulation', function () {

      });
    });
  });
});
