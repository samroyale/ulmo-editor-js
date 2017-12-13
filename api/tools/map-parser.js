#!/usr/bin/env node

function RpgMap(name, rows, cols, mapTiles, sprites) {
  this.name = name;
  this.rows = rows;
  this.cols = cols;
  this.mapTiles = mapTiles;
  this.sprites = sprites;
}

function MapTile(xy, tiles, levels) {
  this.xy = xy;
  this.tiles = tiles;
  this.levels = levels;
}

function Tile(tileSetPrefix, tileName, maskLevel) {
  this.tileSet = tileSetPrefix;
  this.tile = tileName;
  this.maskLevel = maskLevel;
}

function Sprite(type, level, xyArray) {
  this.type = type;
  this.level = level;
  this.location = xyArray;
}

function parseSprite(line) {
  var bits = line.split(' ');
  if (bits.length < 4) {
    return;
  }
  var type = bits[1];
  var level = parseInt(bits[2]);
  var xyArray = bits.slice(3).map(function(bit) {
    xyBits = bit.split(',');
    return [parseInt(xyBits[0]), parseInt(xyBits[1])];
  });
  return new Sprite(type, level, xyArray);
}

function parseMapTile(line) {
  var bits = line.split(' ');
  if (bits.length < 2) {
    return;
  }
  xyBits = bits[0].split(',');
  xy = [parseInt(xyBits[0]), parseInt(xyBits[1])];
  var start = 1;
  if (bits[1].startsWith('[')) {
    var levelBits = bits[1].substr(1, bits[1].length - 2).split(',');
    start++;
  }
  var tiles = bits.slice(start).map(function(bit) {
    tileBits = bit.split(':');
    return new Tile(tileBits[0], tileBits[1], tileBits[2]);
  });
  return new MapTile(xy, tiles, levelBits);
}

require("collections/shim-array"),
require("collections/listen/array-changes");

var fs = require("fs");
var Lazy = require("lazy");

var srcFilename = process.argv[2];
var srcPath = '/Users/samueleldred/workspace/ulmo/ulmo-game/src/maps/' + srcFilename + '.map';
var lazy = new Lazy(fs.createReadStream(srcPath));

console.log('Parsing: ' + srcPath);

lazy.lines
  .map(String)
  .filter(function(line) {
    if (line === '0') {
      return false;
    }
    if (line.startsWith('event') || line.startsWith('music')) {
      return false;
    }
    // either a sprite or a map tile
    return true;
  })
  .map(function(line) {
    if (line.startsWith('sprite')) {
      return parseSprite(line);
    }
    return parseMapTile(line);
  })
  .filter(function(thing) {
    if (thing) {
      return true;
    }
    return false;
  })
  .join(function(things) {
    console.log("Parsed " + things.length + " things");
    var mapTiles = [];
    var sprites = [];
    var maxX = 0, maxY = 0;
    things.forEach(function(thing) {
      if (thing.type) {
        // must be a sprite
        return sprites.push(thing)
      }
      // else a map tile
      var x = thing.xy[0], y = thing.xy[1];
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
      mapTiles.push(thing);
    });
    console.log("> " + mapTiles.length + " map tiles");
    console.log("> " + sprites.length + " sprites");
    var myMap = new RpgMap(srcFilename, maxY + 1, maxX + 1, mapTiles, sprites);
    var writer = fs.createWriteStream('maps/' + srcFilename + '.map.json');
    writer.on('finish', function () {
      console.log("\nDONE");
    });
    writer.write(JSON.stringify(myMap) + '\n', 'utf-8');
    writer.end();
  });
