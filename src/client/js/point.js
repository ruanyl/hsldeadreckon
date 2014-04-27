var Util = require('./util');

var Point = function(lng, lat) {
  this.id = Util.generateUUID();
  this.longitude = lng;
  this.latitude = lat;
  this.probability = null;
  this.prePoint = null;
  this.nextPoint = null;
};

Point.prototype = {
  pre: function(prePoint) {
    if(prePoint) this.prePoint = prePoint;
    return this.prePoint;
  },
  next: function(nextPoint) {
    if(nextPoint) this.nextPoint = nextPoint;
    return this.nextPoint;
  },
  getProb: function() {
    return this.probability;
  }
};

module.exports = Point;
