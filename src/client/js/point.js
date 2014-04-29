var Util = require('./util');

/**
 * Point
 *
 * @param lng {Number} longitude of a candidate point
 * @param lat {Number} latitude of a candidate point
 */
var Point = function(lng, lat) {
  this.id = Util.generateUUID();
  this.longitude = lng;
  this.latitude = lat;
  this.originLongitude = null;
  this.originLatitude = null;
  this.probability = null;
  this.prePointId = null;
  this.nextPointId = null;
  this.isBreakpoint = false;
};

Point.prototype = {
  pre: function(prePoint) {
    if (prePoint) this.prePoint = prePoint;
    return this.prePoint;
  },
  next: function(nextPoint) {
    if (nextPoint) this.nextPoint = nextPoint;
    return this.nextPoint;
  },
  getProb: function() {
    return this.probability;
  }
};

module.exports = Point;
