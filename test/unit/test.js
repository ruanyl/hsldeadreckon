var assert = require("assert");
var chai = require('chai');
chai.should();
var assert = chai.assert;

var Matching = require("../../src/client/js/matching");
var Point = require("../../src/client/js/point");

describe('Matching', function() {
  describe('#pointToSegCross', function() {
    it('should return lat and lng of the cross', function() {
      var cross = Matching.pointToSegCrossEnd(60.18845728866007, 24.834149479866028,
                                           60.1886999769209, 24.834535717964172,
                                           60.18804391441504, 24.83488440513611);
      cross.should.be.a('array');
      cross.should.be.a('array');
    });
  });
});

describe('Point', function() {
  describe('#getProb', function() {
    it('should return probability', function() {
      var point = new Point(0.5);
      assert.equal(point.getProb(), 0.5);
    });
  });
});

describe('Point', function() {
  describe('#prePoint', function() {
    it('should return previous point', function() {
      var point1 = new Point(0.5);
      var point2 = new Point(0.6);
      point1.next(point2);
      assert.equal(point1.next().getProb(), 0.6);
    });
  });
});
