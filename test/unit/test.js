var assert = require("assert");
var chai = require('chai');
chai.should();

var Matching = require("../../src/js/matching");
var Db = require("../../src/js/db");

describe('Matching', function() {
  describe('#pointToSegCross', function() {
    it('should return lat and lng of the cross', function() {
      var cross = Matching.pointToSegCross(60.18845728866007, 24.834149479866028,
                                           60.1886999769209, 24.834535717964172,
                                           60.18804391441504, 24.83488440513611);
      cross.should.have.property('lat').be.a('number');
      cross.should.have.property('lng').be.a('number');
    });
  });
});
