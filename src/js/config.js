var CONFIG_DEFAULT = {
  'city' : 'helsinki',
  'zoom' : 13
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
