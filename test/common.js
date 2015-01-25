var common;
if (process.env.COVERAGE)
  common = require('../cov-lib/common');
else
  common = require('../lib/common');
var chai = require('chai');
var async = require('async');

describe('common', function () {
  describe('values', function () {
    var society = {
      values: {
        conquer: 1,
        discover: 2,
        expand: 3,
        exchange: 4,
        develop: 5,
        consent: 6 
      }
    };

    describe('random', function () {
      it('returns n values of the society randomly', function () {
        var n = 3;
        var choices1 = common.values.random(n, society);
        var choices2 = common.values.random(n, society);
        chai.expect(choices1).to.have.length(n);
        chai.expect(choices2).to.have.length(n);
        chai.expect(choices1).to.not.deep.equal(choices2);
      });
    });

    describe('highest', function () {
      it('returns the top n values of the society', function () {
        var n = 3;
        var choices = common.values.highest(n, society);
        chai.expect(choices).to.have.length(n);
        chai.expect(choices).to.include('exchange', 'develop', 'consent');
      });
    });
  });
});
