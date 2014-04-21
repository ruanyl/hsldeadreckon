var _ = require('underscore');
var $ = require('jquery-node-browserify');

var EARTH_RADIUS = 6378137;

var pointToSegCrossEnd = function(lng, lat, lng1, lat1, lng2, lat2) {
  var cross = (lat2 - lat1) * (lat - lat1) + (lng2 - lng1) * (lng - lng1);
  if (cross <= 0) return [lng1, lat1];

  var d2 = (lat2 - lat1) * (lat2 - lat1) + (lng2 - lng1) * (lng2 - lng1);
  if (cross >= d2) return [lng2, lat2];

  var r = cross / d2;
  var px = lng1 + (lng2 - lng1) * r;
  var py = lat1 + (lat2 - lat1) * r;
  return [px, py];
};

var pointToSegCrossMid = function(lng, lat, lng1, lat1, lng2, lat2) {
  var cross = (lat2 - lat1) * (lat - lat1) + (lng2 - lng1) * (lng - lng1);
  if (cross <= 0) return 0;

  var d2 = (lat2 - lat1) * (lat2 - lat1) + (lng2 - lng1) * (lng2 - lng1);
  if (cross >= d2) return 0;

  var r = cross / d2;
  var px = lng1 + (lng2 - lng1) * r;
  var py = lat1 + (lat2 - lat1) * r;
  return [px, py];
};

var rad = function(d) {
  return d * Math.PI / 180;
};

var pointToPointDist = function(lng1, lat1, lng2, lat2) {
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var radLat = radLat1 - radLat2;
  var radLng = rad(lng1) - rad(lng2);
  var dist = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(radLat / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(radLng / 2), 2)));
  dist = dist * EARTH_RADIUS;
  dist = Math.round(dist * 10000) / 10000;
  return dist;
};

var getCandidatePoints = function(lng, lat, lines) {
  var candidatePoints = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var coordinates = line.geometry.coordinates;
    var dist = 0;
    var pointOffset = 0;
    var clength = coordinates.length;
    console.log('coordinates length ' + coordinates.length);
    for (var j = 0; j < clength; j++) {
      var _dist = pointToPointDist(lng, lat, coordinates[j][0], coordinates[j][1]);
      dist = dist === 0 ? _dist : dist;
      if (_dist < dist) {
        dist = _dist;
        pointOffset = j;
      }
    }
    if (pointOffset === 0) {
      var candidatePoint = pointToSegCrossEnd(lng, lat,
        coordinates[pointOffset][0], coordinates[pointOffset][1],
        coordinates[pointOffset + 1][0], coordinates[pointOffset + 1][1]);
      candidatePoints.push(candidatePoint);
      console.log('0 offset ' + pointOffset);
    } else if (pointOffset === clength - 1) {
      var candidatePoint = pointToSegCrossEnd(lng, lat,
        coordinates[pointOffset][0], coordinates[pointOffset][1],
        coordinates[pointOffset - 1][0], coordinates[pointOffset - 1][1]);
      candidatePoints.push(candidatePoint);
      console.log('-1 offset ' + pointOffset);
    } else {
      var candidatePoint = pointToSegCrossMid(lng, lat,
        coordinates[pointOffset][0], coordinates[pointOffset][1],
        coordinates[pointOffset - 1][0], coordinates[pointOffset - 1][1]);
      if (candidatePoint) {
        candidatePoints.push(candidatePoint);
        console.log('mid offset ' + candidatePoint);
      } else {
        var candidatePoint = pointToSegCrossMid(lng, lat,
          coordinates[pointOffset][0], coordinates[pointOffset][1],
          coordinates[pointOffset + 1][0], coordinates[pointOffset + 1][1]);
        if (candidatePoint) {
          candidatePoints.push(candidatePoint);
          console.log('mid offset ' + candidatePoint);
        } else {
          candidatePoints.push([coordinates[pointOffset][0], coordinates[pointOffset][1]]);
        }
      }
    }
  }
  return candidatePoints;
};

var observationProbability = function(lng, lat, lnglats) {
  var ops = [];
  for (var i = 0; i < lnglats.length; i++) {
    var dist = pointToPointDist(lng, lat, lnglats[i][0], lnglats[i][1]);
    console.log(dist);
    var op = (1 / ((Math.pow(2 * Math.PI), 1 / 2) * 20)) * Math.pow(2.718, -(dist * dist) / (2 * 20 * 20));
    console.log(op);
    ops.push(op);
  }
  return ops;
};

var getCandidateLines = function(lng, lat, radius) {
  $.ajax({
    type: 'POST',
    url: 'http://82.130.25.39:8080/query/nearby',
    data: {
      lat: lat,
      lng: lng,
      radius: radius
    }
  }).done(function(data) {
    var cp = getCandidatePoints(lng, lat, data);
    console.log(cp);
    console.log(observationProbability(lng, lat, cp));
  });
};

module.exports = {
  getCandidateLines: getCandidateLines
};
