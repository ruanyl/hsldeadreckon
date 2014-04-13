;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CONFIG_DEFAULT = {
  'city' : 'helsinki',
  'zoom' : 14
};
var maps = {
  cloudmade : {
    name: "CloudMade",
    url_template: 'http://{s}.tile.cloudmade.com/{key}/{style}/256/{z}/{x}/{y}.png',
    opts: {
      attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2012 CloudMade',
      key: 'dde3e76809d54a2fb29ac08bbc08335a',
      style: 998
    }
  }
};

var cities = {
  helsinki : {
    latitude: '60.170833',
    longitude: '24.9375'
  }
};

var cloudmade = (function() {
  var name = maps.cloudmade.name;
  var url  = maps.cloudmade.url_template
                 .replace("{key}", maps.cloudmade.opts.key)
                 .replace("{style}", maps.cloudmade.opts.style);
  var attribution = maps.cloudmade.opts.attribution;

  return {
    "name" : name,
    "url"  : url,
    "attribution" : attribution
  };
})();

var defaultConfig = (function() {
  var latitude = cities[CONFIG_DEFAULT.city].latitude;
  var longitude = cities[CONFIG_DEFAULT.city].longitude;
  var zoom = CONFIG_DEFAULT.zoom;

  return {
    "latitude" : latitude,
    "longitude" : longitude,
    "zoom" : zoom
  };
})();

module.exports = {
  cloudmade : cloudmade,
  defaultConfig : defaultConfig
};

},{}],2:[function(require,module,exports){
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

},{"./config":1}]},{},[1,2])
;