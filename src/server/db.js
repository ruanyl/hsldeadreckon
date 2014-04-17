var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;


var searchNearby = function() {
  var nearby;
  var db = new Db('geo_helsinki', new Server('localhost', 27017), {safe : true});
  db.open(function(err, db) {
    if(err) throw err;
    var collection = db.collection("geodata");
    collection.find({loc : {$nearSphere : {$geometry : {type : "Point", coordinates: [24.94573473930359, 60.15815784286957]}, $maxDistance : 10}}})
              .toArray(function(err, results) {
                console.dir(err);
                console.dir(results);
              });
  });
  //return nearby;
};

module.exports = {
  searchNearby : searchNearby
};
