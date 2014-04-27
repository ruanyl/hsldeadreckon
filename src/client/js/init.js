var $ = require('jquery-node-browserify');

var config = require('./config');
var Matching = require('./matching');

function init() {
  var lng = 24.94054466485977;
  var lat = 60.15680310720238;
  var radius = 20;

  map = L.map('map');
  map.on('load', setInitMap);
  marker = L.marker([config.defaultConfig.latitude, config.defaultConfig.longitude]).addTo(map);
  map.setView([config.defaultConfig.latitude, config.defaultConfig.longitude], config.defaultConfig.zoom);
  L.tileLayer(config.cloudmade.url, {
    attribution: config.cloudmade.attribution
  }).addTo(map);

  $.ajax({
    type: 'POST',
    url: 'http://82.130.25.39:8080/query/nearby',
    data: {
      lat: lat,
      lng: lng,
      radius: radius
    }
  }).done(function(data) {
    var matching = new Matching();
    var points = matching.getCandidatePoints(lng, lat, data);
    console.log(points);
    console.log(matching.observationProbability(lng, lat, points));
  });
}

function getLocalPoints() {
  var localPoints = null;
  var localPointsJson = localStorage.getItem('localPoints');
  if(localPointsJson !== null) {
    try {
      localPoints = JSON.parse(localPointsJson);
    } catch(e) {
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
