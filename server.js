// server.js

// BASE SETUP
// =============================================================================

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// define our app using express
var app = express();
// configure app to use bodyParser - this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
app.use(bodyParser.json({limit: '1mb'}));
//app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));

//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
mongoose.connect('mongodb://localhost/ulmo');

var schema = require('./app/model/schema');
var TileSet = schema.TileSet;
var RpgMap = schema.RpgMap;

var port = process.env.PORT || 8081; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('Received: ' + req.originalUrl);
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Hello! Welcome to our api' });
});

// on routes that end in /tilesets/tileset
// ----------------------------------------------------
router.route('/tilesets/tileset')
  // get the named TileSets (accessed at GET http://localhost:8080/api/tilesets/tileset?name=grass)
  .get(function(req, res) {
    if (!req.query.name) {
      res.status(400).send({ err: 'Tileset name not specified' });
    }
    TileSet.findOne({name: req.query.name}, function (err, tileSet) {
      if (err) {
        console.log(err.toString());
        res.status(500).send(err);
        return;
      }
      res.json(tileSet);
      return;
    });
  });

// on routes that end in /tilesets
// ----------------------------------------------------
router.route('/tilesets')
  // create a TileSet (accessed at POST http://localhost:8080/api/tilesets)
  .post(function(req, res) {
    var tileSet = new TileSet();
    tileSet.name = req.body.name;
    tileSet.imageUrl = req.body.imageUrl;
    tileSet.tiles = req.body.tiles;

    // save the TileSet and check for errors
    tileSet.save(function(err) {
      if (err) {
        console.log(err.toString());
        res.status(500).send(err);
        return;
      }
      res.json({ message: 'TileSet created!' });
    });
  })

  // get all the TileSets (accessed at GET http://localhost:8080/api/tilesets)
  .get(function(req, res) {
    /*TileSet.find(function(err, tileSets) {
      if (err)
        res.send(err);
      res.json(tileSets);
    });*/
    TileSet.find({}, '_id name', function(err, tileSets) {
      if (err) {
        console.log(err.toString());
        res.status(500).send(err);
        return;
      }
      res.json(tileSets);
    });
  });

// on routes that end in /tilesets/:tileset_id
// ----------------------------------------------------
router.route('/tilesets/:tileset_id')
  // get the TileSet with that id (accessed at GET http://localhost:8080/api/tileset/:tileset_id)
  .get(function(req, res) {
    TileSet.findById(req.params.tileset_id, function(err, tileSet) {
      if (err) {
        console.log(err.toString());
        res.status(500).send(err);
        return;
      }
      if (!tileSet) {
        res.status(404).send({ err: 'Tileset not found: ' + req.params.tileset_id });
        return;
      }
      res.json(tileSet);
    });
  })

  // update the TileSet with this id (accessed at PUT http://localhost:8080/api/tileset/:tileset_id)
  .put(function(req, res) {
    TileSet.findById(req.params.tileset_id, function(err, tileSet) {
      if (err) {
        console.log(err.toString());
        res.status(500).send(err);
        return;
      }
      if (!tileSet) {
        res.status(404).send({ err: 'Tileset not found: ' + req.params.tileset_id });
        return;
      }
      tileSet.name = req.body.name;
      tileSet.imageUrl = req.body.imageUrl;
      tileSet.tiles = req.body.tiles;

      // save the TileSet
      tileSet.save(function(err) {
        if (err) {
          console.log(err.toString());
          res.status(500).send(err);
          return;
        }
        res.json({ message: 'TileSet updated!' });
      });
    });
  })

  // delete the TileSet with this id (accessed at DELETE http://localhost:8080/api/tileset/:tileset_id)
  .delete(function(req, res) {
    TileSet.remove({ _id: req.params.tileset_id }, function(err, tileSet) {
      if (err) {
        console.log(err.toString());
        res.status(500).send(err);
        return;
      }
      if (!tileSet) {
        res.status(404).send({ err: 'Tileset not found: ' + req.params.tileset_id });
        return;
      }
      res.json({ message: 'TileSet deleted!' });
    });
  });

// on routes that end in /maps/new
// ----------------------------------------------------
router.route('/maps/new')
  // get the named TileSets (accessed at GET http://localhost:8080/api/tilesets/tileset?name=grass)
  .get(function(req, res) {
    console.log("rows: " + req.query.rows + ", cols: " + req.query.cols);
    if (req.query.rows && req.query.cols) {
      var rpgMap = {
        rows: req.query.rows,
        cols: req.query.cols,
        mapTiles: []
      }
      res.json(rpgMap);
      return;
    }
    res.status(400).json({ err: 'Map size not specified' });
  });

// on routes that end in /maps
// ----------------------------------------------------
router.route('/maps')
  // create an RpgMap (accessed at POST http://localhost:8080/api/maps)
  .post(function(req, res) {
    var rpgMap = new RpgMap();
    rpgMap.name = req.body.name;
    rpgMap.rows = req.body.rows;
    rpgMap.cols = req.body.cols;
    rpgMap.mapTiles = req.body.mapTiles;

    // save the RpgMap and check for errors
    rpgMap.save(function(err, savedMap) {
      if (err) {
        console.log(err.toString());
        res.status(500).send(err);
        return;
      }
      res.json({ message: 'RpgMap created', mapId: savedMap.id });
    });
  })

  // get all the RpgMaps (accessed at GET http://localhost:8080/api/maps)
  .get(function(req, res) {
    /*RpgMap.find(function(err, rpgMaps) {
      if (err)
        res.send(err);
      res.json(rpgMaps);
    });*/
    RpgMap.find({}, '_id name', function(err, rpgMaps) {
      if (err) {
        console.log(err.toString());
        res.status(500).send(err);
        return;
      }
      res.json(rpgMaps);
    });
  });

// on routes that end in /maps/:map_id
// ----------------------------------------------------
router.route('/maps/:map_id')
  // get the RpgMap with that id (accessed at GET http://localhost:8080/api/maps/:map_id)
  .get(function(req, res) {
    RpgMap.findById(req.params.map_id, function(err, rpgMap) {
      if (err) {
        console.log(err.toString());
        res.status(500).send(err);
        return;
      }
      if (!rpgMap) {
        res.status(404).send({ err: 'Map not found: ' + req.params.map_id });
        return;
      }
      res.json(rpgMap);
    });
  })

  // update the RpgMap with this id (accessed at PUT http://localhost:8080/api/maps/:map_id)
  .put(function(req, res) {
    RpgMap.findById(req.params.map_id, function(err, rpgMap) {
      if (err) {
        console.log(err.toString());
        res.status(500).send(err);
        return;
      }
      if (!rpgMap) {
        res.status(404).send({ err: 'Map not found: ' + req.params.map_id });
        return;
      }
      rpgMap.name = req.body.name;
      rpgMap.rows = req.body.rows;
      rpgMap.cols = req.body.cols;
      rpgMap.mapTiles = req.body.mapTiles;

      // save the RpgMap
      rpgMap.save(function(err, savedMap) {
        if (err) {
          console.log(err.toString());
          res.status(500).send(err);
          return;
        }
        res.json({ message: 'RpgMap updated', mapId: savedMap.id });
      });
    });
  })

  // delete the RpgMap with this id (accessed at DELETE http://localhost:8080/api/maps/:map_id)
  .delete(function(req, res) {
    RpgMap.remove({ _id: req.params.map_id }, function(err, rpgMap) {
      if (err) {
        console.log(err.toString());
        res.status(500).send(err);
        return;
      }
      if (!rpgMap) {
        res.status(404).send({ err: 'Map not found: ' + req.params.map_id });
        return;
      }
      res.json({ message: 'RpgMap deleted', mapId: req.params.map_id });
    });
  });

// REGISTER ROUTES
// =============================================================================
// all our API routes will be prefixed with /api
app.use('/api', router);
// static content is served from the 'static' folder
app.use(express.static(__dirname + '/static'));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
