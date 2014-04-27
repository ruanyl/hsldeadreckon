
var Point = require('./point');

var Matching = function() {
  this.EARTH_RADIUS = 6378137;
  this.DEVIATION = 20;
};

Matching.prototype = {
  pointToSegCrossEnd: function(lng, lat, lng1, lat1, lng2, lat2) {
    var cross = (lat2 - lat1) * (lat - lat1) + (lng2 - lng1) * (lng - lng1);
    if (cross <= 0) return new Point(lng1, lat1);

    var d2 = (lat2 - lat1) * (lat2 - lat1) + (lng2 - lng1) * (lng2 - lng1);
    if (cross >= d2) return new Point(lng2, lat2);

    var r = cross / d2;
    var px = lng1 + (lng2 - lng1) * r;
    var py = lat1 + (lat2 - lat1) * r;
    return new Point(px, py);
  },
  pointToSegCrossMid: function(lng, lat, lng1, lat1, lng2, lat2) {
    var cross = (lat2 - lat1) * (lat - lat1) + (lng2 - lng1) * (lng - lng1);
    if (cross <= 0) return 0;

    var d2 = (lat2 - lat1) * (lat2 - lat1) + (lng2 - lng1) * (lng2 - lng1);
    if (cross >= d2) return 0;

    var r = cross / d2;
    var px = lng1 + (lng2 - lng1) * r;
    var py = lat1 + (lat2 - lat1) * r;
    return new Point(px, py);
  },
  rad: function(d) {
    return d * Math.PI / 180;
  },
  pointToPointDist: function(lng1, lat1, lng2, lat2) {
    var radLat1 = this.rad(lat1);
    var radLat2 = this.rad(lat2);
    var radLat = radLat1 - radLat2;
    var radLng = this.rad(lng1) - this.rad(lng2);
    var dist = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(radLat / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(radLng / 2), 2)));
    dist = dist * this.EARTH_RADIUS;
    dist = Math.round(dist * 10000) / 10000;
    return dist;
  },
  getCandidatePoints: function(lng, lat, localPoints, lines) {
    //find nearby points on the lines
    var candidatePoints = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var coordinates = line.geometry.coordinates;
      var dist = 0;
      var pointOffset = 0;
      var clength = coordinates.length;
      console.log('coordinates length ' + coordinates.length);
      for (var j = 0; j < clength; j++) {
        var _dist = this.pointToPointDist(lng, lat, coordinates[j][0], coordinates[j][1]);
        dist = dist === 0 ? _dist : dist;
        if (_dist < dist) {
          dist = _dist;
          pointOffset = j;
        }
      }
      if (pointOffset === 0) {
        var candidatePoint = this.pointToSegCrossEnd(lng, lat,
          coordinates[pointOffset][0], coordinates[pointOffset][1],
          coordinates[pointOffset + 1][0], coordinates[pointOffset + 1][1]);
        candidatePoints.push(candidatePoint);
        console.log('0 offset ' + pointOffset);
      } else if (pointOffset === clength - 1) {
        var candidatePoint = this.pointToSegCrossEnd(lng, lat,
          coordinates[pointOffset][0], coordinates[pointOffset][1],
          coordinates[pointOffset - 1][0], coordinates[pointOffset - 1][1]);
        candidatePoints.push(candidatePoint);
        console.log('-1 offset ' + pointOffset);
      } else {
        var candidatePoint = this.pointToSegCrossMid(lng, lat,
          coordinates[pointOffset][0], coordinates[pointOffset][1],
          coordinates[pointOffset - 1][0], coordinates[pointOffset - 1][1]);
        if (candidatePoint) {
          candidatePoints.push(candidatePoint);
          console.log('mid offset ' + candidatePoint);
        } else {
          var candidatePoint = this.pointToSegCrossMid(lng, lat,
            coordinates[pointOffset][0], coordinates[pointOffset][1],
            coordinates[pointOffset + 1][0], coordinates[pointOffset + 1][1]);
          if (candidatePoint) {
            candidatePoints.push(candidatePoint);
            console.log('mid offset ' + candidatePoint);
          } else {
            candidatePoints.push(new Point(coordinates[pointOffset][0], coordinates[pointOffset][1]));
          }
        }
      }
    }
    //add observation probability
    candidatePoints = this.observationProbability(lng, lat, candidatePoints);
    var points = localPoints ? localPoints : [];
    points.push(candidatePoints);
    return points;
  },
  observationProbability: function(lng, lat, points) {
    var ops = [];
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      var dist = this.pointToPointDist(lng, lat, point.longitude, point.latitude);
      console.log(dist);
      var op = (1 / (Math.pow(2 * Math.PI, 1 / 2) * this.DEVIATION)) * Math.pow(Math.E, -(dist * dist) / (2 * this.DEVIATION * this.DEVIATION));
      point.probability = op;
    }
    return points;
  }
};

module.exports = Matching;
