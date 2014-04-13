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
  //load geojson
  $.ajax({
    url: '/static/map2.json'
  }).done(renderGeoData);
}

function setPosition(latitude, longitude) {
  map.setView([latitude, longitude], config.defaultConfig.zoom);
  var marker = L.marker([latitude, longitude]).addTo(map);
}

function renderGeoData(data) {
  var latlngs = [];
  var features = data.features[0].geometry.coordinates;
  //var polyline = L.polyline(latlngs, {color: 'red', smoothFactor: 2}).addTo(map);
  //for(var i=0; i < features.length; i++) {
    //var latlng = L.latLng(features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]);
    //latlngs.push(latlng);
    //polyline.addLatLng(latlng);
    //map.fitBounds(polyline.getBounds());
  //}
  //console.log(latlngs);
  var multiPolygon = L.multiPolygon(features, {color: 'red', smoothFactor: 2}).addTo(map);
  map.fitBounds(multiPolygon.getBounds());
}
init();
