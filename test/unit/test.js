var assert = require("assert");
var chai = require('chai');

chai.should();
var assert = chai.assert;

var Matching = require("../../src/client/js/matching");
var Point = require("../../src/client/js/point");
var Projection = require("../../src/client/js/projection");

describe('Matching', function() {
  describe('#pointToSegCross', function() {
    it('should return lat and lng of the cross', function() {
      var matching = new Matching();
      var cross = matching.pointToSegCrossEnd(24.939718544483185, 60.15660956897764,
                                           24.939608573913574, 60.15683647574664,
                                           24.940094053745266, 60.156546835653344);
      console.log(cross);
    });
  });
});

describe('Projection', function() {
  describe('#ll2m', function() {
    it('should return mercator', function() {
      var projection = new Projection();
      console.log(projection.ll2m(24.939608573913574, 60.15683647574664));
    });
  });
});

describe('Projection', function() {
  describe('#m2ll', function() {
    it('should return mercator', function() {
      var projection = new Projection();
      console.log(projection.m2ll(2776264.5270316186, 8397640.9494729));
    });
  });
});
