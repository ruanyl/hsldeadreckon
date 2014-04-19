var config = require('./config');
var Matching = require('./matching');

function init() {
  Matching.getCandidateLines(24.94557648897171, 60.15812047160007, 20);
  map = L.map('map');
  map.on('load', setInitMap);
  marker = L.marker([config.defaultConfig.latitude, config.defaultConfig.longitude]).addTo(map);
  map.setView([config.defaultConfig.latitude, config.defaultConfig.longitude], config.defaultConfig.zoom);
  L.tileLayer(config.cloudmade.url, {
    attribution: config.cloudmade.attribution
  }).addTo(map);

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
