var $ = require('jquery-node-browserify');

var config = require('./config');
var demoRoutes = require('./demoRoutes');

var radius = 100;
var mapRoute = null;
var markers = [];

function init() {
  setLocalPoints(null);

  map = L.map('map');
  //map.on('load', setInitMap);
  marker = L.marker([config.defaultConfig.latitude, config.defaultConfig.longitude]).addTo(map);
  map.setView([config.defaultConfig.latitude, config.defaultConfig.longitude], config.defaultConfig.zoom);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  /*L.tileLayer(config.cloudmade.url, {*/
    //attribution: config.cloudmade.attribution
  /*}).addTo(map);*/

  map.on('click', addMarker);
  $('.undo-btn').bind('click', undoDrawRoute);
  $('.save-markers-btn').bind('click', getLatLngsFromMarkers);
  $('.demo-A').bind('click', demoA);
}

function addMarker(e) {
  var lat = e.latlng.lat;
  var lng = e.latlng.lng;
  var m = L.marker([lat, lng]).addTo(map);
  markers.push(m);
  matching(lat, lng);
}

function matching(lat, lng) {
  $.ajax({
    type: 'POST',
    url: 'http://82.130.25.39:8080/query/nearby',
    data: {
      lng: lng,
      lat: lat,
      radius: radius
    }
  }).done(function(data) {
    if (data.length) {
      var localPoints = getLocalPoints();
      var matching = new M.STMatching();
      var points = matching.getCandidatePoints(lng, lat, localPoints, data);
      setLocalPoints(points);
      var routes = matching.findRoute(points);
      drawRoute(routes);
    }
  });
}

function demoA() {
  var routeA = demoRoutes.routeA,
    len = routeA.length,
    i = 2,
    markersL = [];

  var bikeIcon = L.icon({
    iconUrl: 'js/images/marker-bike-green-shadowed.png',
    iconSize: [25, 39],
    iconAnchor: [12, 39],
    shadowUrl: null
  });

  var latlng1 = L.latLng(routeA[0][0], routeA[0][1]);
  var latlng2 = L.latLng(routeA[1][0], routeA[1][1]);
  setTimeout(function() {
    matching(routeA[0][0], routeA[0][1])
  }, 1000);

  setTimeout(function() {
    matching(routeA[1][0], routeA[1][1])
  }, 2000);

  map.setView([routeA[0][0], routeA[0][1]], 18);

  markersL.push(latlng1, latlng2);
  console.log(markersL);
  animatedMarker = L.animatedMarker(markersL, {
    icon: bikeIcon,
    interval: 12000,
    onEnd: function() {
      if (i < len) {
        console.log(animatedMarker);
        this.addLatLng(L.latLng([routeA[i][0], routeA[i][1]]));
        matching(routeA[i][0], routeA[i][1])
      }
      i += 1;
    }
  });
  map.addLayer(animatedMarker);
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
  if (mapRoute) var routeLength = mapRoute.getLatLngs().length;
  if (routeLength) {
    mapRoute.spliceLatLngs(routeLength - 1, 1);

    var points = getLocalPoints();
    points.pop();
    setLocalPoints(points);

    var m = markers.pop();
    map.removeLayer(m);
  }
}

function getLatLngsFromMarkers() {
  var latlngs = [];
  $.each(markers, function(i, marker) {
    var latlng = [marker.getLatLng().lat, marker.getLatLng().lng];
    latlngs.push(latlng);
  });
  console.log(JSON.stringify(latlngs));
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
  //console.log(routes);
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
