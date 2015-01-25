var StdOutFixture = require('fixture-stdout');
var chai = require('chai');
var mock = require('mock-fs');
var fs = require('fs');
var report;
if (process.env.COVERAGE)
  report = require('../cov-lib/report');
else
  report = require('../lib/report');

var REPORT = require('./report.json');

describe('report', function () {
  describe('prettyprint', function () {
    it('should print to stdout', function () {
      var fixture = new StdOutFixture();
      var _writes = [];

      fixture.capture(function () {
        _writes.push(arguments);
        return false;
      });

      report.prettyprint(REPORT);
      fixture.release();
      chai.expect(_writes.length).to.be.above(0);
    });
  });

  describe('to_file', function () {
    before(function () {
      mock();
    });

    after(function () {
      mock.restore();
    });

    it('should print game state to file as JSON', function () {
      report.to_file('_report.json')(REPORT);
      var _report = JSON.parse(fs.readFileSync('_report.json').toString());
      chai.expect(_report.length).to.equal(REPORT.length);
    });
  });

  describe('to_json', function () {
    it('should print game state as JSON', function () {
      var fixture = new StdOutFixture();
      var _writes = [];
      fixture.capture(function () {
        _writes.push(arguments);
        return false;
      });
      report.to_json()(REPORT);
      fixture.release();
      chai.expect(_writes.length).to.be.above(0);
    });
  });
});
