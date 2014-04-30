var $ = require('jquery-node-browserify');

var config = require('./config');
var Matching = require('./matching');

var radius = 100;
var mapRoute = null;
var markers = [];

function init() {
  setLocalPoints(null);

  map = L.map('map');
  map.on('load', setInitMap);
  marker = L.marker([config.defaultConfig.latitude, config.defaultConfig.longitude]).addTo(map);
  map.setView([config.defaultConfig.latitude, config.defaultConfig.longitude], config.defaultConfig.zoom);
  L.tileLayer(config.cloudmade.url, {
    attribution: config.cloudmade.attribution
  }).addTo(map);

  map.on('click', matching);
  $('.undo-btn').bind('click', undoDrawRoute);
}

function matching(e) {
  var m = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
  markers.push(m);
  $.ajax({
    type: 'POST',
    url: 'http://82.130.25.39:8080/query/nearby',
    data: {
      lng: e.latlng.lng,
      lat: e.latlng.lat,
      radius: radius
    }
  }).done(function(data) {
    if (data.length) {
      var localPoints = getLocalPoints();
      var matching = new Matching();
      var points = matching.getCandidatePoints(e.latlng.lng, e.latlng.lat, localPoints, data);
      setLocalPoints(points);
      var routes = findRoute(points);
      drawRoute(routes);
    }
  });
}

function drawRoute(routes) {
  if (mapRoute) map.removeLayer(mapRoute);

  var routePoints = [];
  for (var i = 0; i < routes.length; i++) {
    var point = {
      lat: routes[i].latitude,
      lon: routes[i].longitude
    };
    routePoints.push(point);
  }
  if (routePoints.length >= 2) {
    mapRoute = L.polyline(routePoints).addTo(map);
  }
}

function undoDrawRoute() {
  var routeLength = mapRoute.getLatLngs().length;
  mapRoute.spliceLatLngs(routeLength-1, 1);

  var points = getLocalPoints();
  points.pop();
  setLocalPoints(points);

  var m = markers.pop();
  map.removeLayer(m);
}

function findRoute(points) {
  var cPoints = points[points.length - 1];
  var point = cPoints[0];
  var routes = [];
  for (var i = 1; i < cPoints.length; i++) {
    var _point = cPoints[i];
    if (_point.probability > point.probability) point = _point;
  }
  routes.unshift(point);

  var prePointId = point.prePointId;
  for (var i = points.length - 2; i >= 0; i--) {
    var _points = points[i];
    for (var j = 0; j < _points.length; j++) {
      var _point = _points[j];
      if (_point.id === prePointId) {
        routes.unshift(_point);
        prePointId = _point.prePointId;
      }
    }
  }
  console.log(routes);
  return routes;
}

function getLocalPoints() {
  var localPoints = null;
  var localPointsJson = localStorage.getItem('localPoints');
  if (localPointsJson !== null) {
    try {
      localPoints = JSON.parse(localPointsJson);
    } catch (e) {
      console.log('Invalid localStorage contents');
      localPoints = null;
    }
  }
  return localPoints;
}

function setLocalPoints(points) {
  var localPointsJson = JSON.stringify(points);
  localStorage.setItem('localPoints', localPointsJson);
}

function setInitMap() {
  //Get geolocation
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      setPosition(latitude, longitude);
    });
  } else {
    console.log("Not support Geolocation!");
    var latitude = config.defaultConfig.latitude;
    var longitude = config.defaultConfig.longitude;
    setPosition(latitude, longitude);
  }
}

function setPosition(latitude, longitude) {
  map.setView([latitude, longitude], config.defaultConfig.zoom);
  marker.setLatLng([latitude, longitude]);
}

init();
