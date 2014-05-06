(function() {
  M.Point = function(lng, lat) {
    this.id = M.Util.generateUUID();
    this.longitude = lng;
    this.latitude = lat;
    this.originLongitude = null;
    this.originLatitude = null;
    this.probability = null;
    this.prePointId = null;
    this.nextPointId = null;
    this.isBreakpoint = false;
  };

  M.Point.prototype = {
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
})();
