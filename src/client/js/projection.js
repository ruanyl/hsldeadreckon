var Projection = function() {
  this.r_major = 6378137.000;
  this.r_minor = 6356752.314245179;
  this.f = 298.257223563;
};

Projection.prototype = {
  deg2rad: function(d) {
    var r = d * (Math.PI / 180.0);
    return r;
  },
  rad2deg: function(r) {
    var d = r / (Math.PI / 180.0);
    return d;
  },
  ll2m: function(lon, lat) //lat lon to mercator
  {
    //lat, lon in rad
    var x = this.r_major * this.deg2rad(lon);

    if (lat > 89.5) lat = 89.5;
    if (lat < -89.5) lat = -89.5;

    var temp = this.r_minor / this.r_major;
    var es = 1.0 - (temp * temp);
    var eccent = Math.sqrt(es);
    var phi = this.deg2rad(lat);
    var sinphi = Math.sin(phi);
    var con = eccent * sinphi;
    var com = .5 * eccent;
    var con2 = Math.pow((1.0 - con) / (1.0 + con), com);
    var ts = Math.tan(.5 * (Math.PI * 0.5 - phi)) / con2;
    var y = 0 - this.r_major * Math.log(ts);
    var ret = [x, y];
    return ret;
  },
  m2ll: function(x, y) //mercator to lat lon
  {
    var lon = this.rad2deg((x / this.r_major));
    var temp = this.r_minor / this.r_major;
    var e = Math.sqrt(1.0 - (temp * temp));
    var lat = this.rad2deg(this.pj_phi2(Math.exp(0 - (y / this.r_major)), e));
    var ret = [lon, lat];
    return ret;
  },
  pj_phi2: function(ts, e) {
    var N_ITER = 15;
    var HALFPI = Math.PI / 2;
    var TOL = 0.0000000001;
    var eccnth, Phi, con, dphi;
    var i;
    var eccnth = .5 * e;
    Phi = HALFPI - 2. * Math.atan(ts);
    i = N_ITER;
    do {
      con = e * Math.sin(Phi);
      dphi = HALFPI - 2. * Math.atan(ts * Math.pow((1. - con) / (1. + con), eccnth)) - Phi;
      Phi += dphi;
    }
    while (Math.abs(dphi) > TOL && --i);
    return Phi;
  }
};

module.exports = Projection;
