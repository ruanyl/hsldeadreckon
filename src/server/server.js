var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var server = express();
var serverPath = __dirname;
var rootPath = serverPath + '/../..';

var router = express.Router();
var Db;

server.use(express.static(rootPath + '/public'));
server.use('/components', express.static(rootPath + '/bower_components'));
server.use(bodyParser());

router.route('/nearby')
      .post(function(req, res) {
        var collection = Db.collection("geodata");
        var lat = +req.body.lat,
            lng = +req.body.lng,
            radius = +req.body.radius || 20;
        var query = {loc : {$nearSphere : {$geometry : {type : "Point", coordinates: [lng, lat]}, $maxDistance : radius}}};
        console.log(JSON.stringify(query));
        collection.find(query).toArray(function(err, docs) {
          err && res.send(err);
          res.json(docs);
        });
      });
server.use('/query', router);

var port = process.env.PORT || 8080;

MongoClient.connect('mongodb://localhost:27017/geo_helsinki', function(err, db) {
  err && console.log(err);
  Db = db;
  server.listen(port);
  console.log('server start at ' + port);
});

