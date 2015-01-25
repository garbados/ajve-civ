var common;
if (process.env.COVERAGE)
  common = require('../cov-lib/common');
else
  common = require('../lib/common');
var chai = require('chai');
var async = require('async');

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

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
        while(arraysEqual(choices1, choices2)) {
          choices1 = common.values.random(n, society);
          choices2 = common.values.random(n, society);
        }
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
