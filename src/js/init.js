var config = require('./config');

function init() {
  map = L.map('map');
  map.on('load', setInitMap);
  map.setView([config.defaultConfig.latitude, config.defaultConfig.longitude], config.defaultConfig.zoom);
  L.tileLayer(config.cloudmade.url, {
    attribution: config.cloudmade.attribution
  }).addTo(map);

}

function setInitMap() {
  //Get geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
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
  //load geojson
  $.ajax({
    url: '/static/geo.json'
  }).done(renderGeoData);
}

function setPosition(latitude, longitude) {
  map.setView([latitude, longitude], config.defaultConfig.zoom);
  var marker = L.marker([latitude, longitude]).addTo(map);
}

function renderGeoData(data) {
  L.geoJson(data, {
    style: function(feature) {
      return {
        color: feature.properties.color
      };
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.timestamp);
    }
  }).addTo(map);
}
init();
