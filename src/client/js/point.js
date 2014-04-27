var Util = require('./util');

/**
 * Point
 *
 * @param lng {Number} longitude of a candidate point
 * @param lat {Number} latitude of a candidate point
 * @param o_lng {Number} longitude of original point
 * @param o_lat {Number} latitude of original point
 */
var Point = function(lng, lat, o_lng, o_lat) {
  this.id = Util.generateUUID();
  this.longitude = lng;
  this.latitude = lat;
  this.originLongitude = o_lng;
  this.originLatitude = o_lat;
  this.probability = null;
  this.prePointId = null;
  this.nextPointId = null;
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
