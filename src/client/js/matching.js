var Point = require('./point');
var Projection = require('./projection');

var Matching = function() {
  this.EARTH_RADIUS = 6378137;
  this.DEVIATION = 20;
  this.OFFSET = 3 / 4;
};

Matching.prototype = {
  pointToSegCross: function(lng, lat, lng1, lat1, lng2, lat2) {
    var projection = new Projection();
    var p = projection.ll2m(lng, lat);
    var p1 = projection.ll2m(lng1, lat1);
    var p2 = projection.ll2m(lng2, lat2);

    var cross = (p2[1] - p1[1]) * (p[1] - p1[1]) + (p2[0] - p1[0]) * (p[0] - p1[0]);
    if (cross <= 0) {
      var point = new Point(lng1, lat1);
      point.originLongitude = lng;
      point.originLatitude = lat;
      point.isBreakpoint = true;
      return point;
    }

    var d2 = (p2[1] - p1[1]) * (p2[1] - p1[1]) + (p2[0] - p1[0]) * (p2[0] - p1[0]);
    if (cross >= d2) {
      var point = new Point(lng2, lat2);
      point.originLongitude = lng;
      point.originLatitude = lat;
      point.isBreakpoint = true;
      return point;
    }

    var r = cross / d2;
    var px = p1[0] + (p2[0] - p1[0]) * r;
    var py = p1[1] + (p2[1] - p1[1]) * r;
    var pp = projection.m2ll(px, py);
    var point = new Point(pp[0], pp[1]);
    point.originLongitude = lng;
    point.originLatitude = lat;
    point.isBreakpoint = false;

    return point;
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
      for (var j = 0; j < clength; j++) {
        var _dist = this.pointToPointDist(lng, lat, coordinates[j][0], coordinates[j][1]);
        dist = dist === 0 ? _dist : dist;
        if (_dist < dist) {
          dist = _dist;
          pointOffset = j;
        }
      }
      if (pointOffset === 0) {
        var candidatePoint = this.pointToSegCross(lng, lat,
          coordinates[pointOffset][0], coordinates[pointOffset][1],
          coordinates[pointOffset + 1][0], coordinates[pointOffset + 1][1]);
        candidatePoints.push(candidatePoint);
      } else if (pointOffset === clength - 1) {
        var candidatePoint = this.pointToSegCross(lng, lat,
          coordinates[pointOffset][0], coordinates[pointOffset][1],
          coordinates[pointOffset - 1][0], coordinates[pointOffset - 1][1]);
        candidatePoints.push(candidatePoint);
      } else {
        var candidatePoint1 = this.pointToSegCross(lng, lat,
          coordinates[pointOffset][0], coordinates[pointOffset][1],
          coordinates[pointOffset - 1][0], coordinates[pointOffset - 1][1]);

        var candidatePoint2 = this.pointToSegCross(lng, lat,
          coordinates[pointOffset][0], coordinates[pointOffset][1],
          coordinates[pointOffset + 1][0], coordinates[pointOffset + 1][1]);

        var d1 = this.pointToPointDist(candidatePoint1.longitude, candidatePoint1.latitude,
          candidatePoint1.originLongitude, candidatePoint1.originLatitude);

        var d2 = this.pointToPointDist(candidatePoint2.longitude, candidatePoint2.latitude,
          candidatePoint2.originLongitude, candidatePoint2.originLatitude);

        if (d1 < d2) {
          candidatePoints.push(candidatePoint1);
        } else {
          candidatePoints.push(candidatePoint2);
        }
      }
    }
    //add observation probability
    candidatePoints = this.observationProbability(lng, lat, candidatePoints);
    var points = localPoints ? localPoints : [];
    points.push(candidatePoints);
    if (points.length > 1) {
      points = this.transmissionProbability(points);
    }
    return points;
  },
  observationProbability: function(lng, lat, points) {
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      var dist = this.pointToPointDist(lng, lat, point.longitude, point.latitude);
      var op = (1 / (Math.pow(2 * Math.PI, 1 / 2) * this.DEVIATION)) * Math.pow(Math.E, -(dist * dist) / (2 * this.DEVIATION * this.DEVIATION));
      point.probability = op;
    }
    return points;
  },
  transmissionProbability: function(points) {
    var currentPoints = points[points.length - 1];
    var previousPoints = points[points.length - 2];
    var p_dist = this.pointToPointDist(currentPoints[0].originLongitude, currentPoints[0].originLatitude,
      previousPoints[0].originLongitude, previousPoints[0].originLatitude);
    //console.log('p_dist:' + p_dist);
    for (var i = 0; i < currentPoints.length; i++) {
      var currentPoint = currentPoints[i];
      var otp = 0;
      for (var j = 0; j < previousPoints.length; j++) {
        var previousPoint = previousPoints[j];
        var c_dist = this.pointToPointDist(currentPoint.longitude, currentPoint.latitude, previousPoint.longitude, previousPoint.latitude);
        var tp = 0;
        if (c_dist >= this.OFFSET * p_dist) {
          //console.log('currentPoint.probability:' + currentPoint.probability);
          //console.log('c_dist:' + c_dist);
          tp = p_dist / c_dist;
          //console.log('tp:' + tp);
        }
        var _otp = currentPoint.probability * tp + previousPoint.probability;
        if (_otp > otp) {
          otp = _otp;
          currentPoint.prePointId = previousPoint.id;
        }
      }
      currentPoint.probability = otp;
    }
    return points;
  }
};

module.exports = Matching;
