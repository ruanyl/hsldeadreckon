var Point = function(probability) {
  this.probability = probability;
  this.prePoint = null;
  this.nextPoint = null;
  this.latitude = null;
  this.longitude = null;
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
