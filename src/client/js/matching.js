var _ = require('underscore');

var EARTH_RADIUS = 6378.137;

var pointToSegCross = function(lat, lng, lat1, lng1, lat2, lng2) {
  var cross = (lat2 - lat1) * (lat - lat1) + (lng2 - lng1) * (lng - lng1);
  if (cross <= 0) return {lat : lat1, lng : lng1};

  var d2 = (lat2 - lat1) * (lat2 - lat1) + (lng2 - lng1) * (lng2 - lng1);
  if (cross >= d2) return {lat : lat2, lng : lng2};

  var r = cross / d2;
  var px = lat1 + (lat2 - lat1) * r;
  var py = lng1 + (lng2 - lng1) * r;
  return {lat : px, lng : py};
};

var rad = function(d) {
  return d * Math.PI / 180;
};

var pointToPointDist = function(lat1, lng1, lat2, lng2) {
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var radLat = radLat1 - radLat2;
  var radLng = rad(lng1) - rad(lng2);
  var dist = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(radLat/2), 2) +
             Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(radLng/2), 2)));
  dist = dist * EARTH_RADIUS;
  dist = Math.round(dist * 10000) / 10000;
  return dist;
};

var getCandidate = function() {

}

module.exports = {
  pointToSegCross : pointToSegCross
};
