function RpgMap(name, rows, cols, mapTiles) {
  this.name = name;
  this.rows = rows;
  this.cols = cols;
  this.mapTiles = mapTiles;
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

require("collections/shim-array"),
require("collections/listen/array-changes");

var fs = require("fs");
var Lazy = require("lazy");


var srcFilename = process.argv[2];
var srcPath = '/Users/samueleldred/workspace/ulmo/ulmo-game/src/maps/' + srcFilename + '.map';
var lazy = new Lazy(fs.createReadStream(srcPath));

console.log('Parsing: ' + srcPath);

lazy
  .lines
  .map(String)
  .filter(function(line) {
    if (line == '0') {
      return false;
    }
    if ((line.search('sprite') == 0) || (line.search('event') == 0) || (line.search('music') == 0)) {
      return false;
    }
    return true;
  })
  .map(function(line) {
    var bits = line.split(' ');
    if (bits.length < 2)
      return;
    xyBits = bits[0].split(',');
    xy = [parseInt(xyBits[0]), parseInt(xyBits[1])];
    var start = 1;
    if (bits[1].search('\\[') == 0) {
      var levelBits = bits[1].substr(1, bits[1].length - 2).split(',');
      start++;
    }
    var tiles = bits.slice(start).map(function(bit) {
      tileBits = bit.split(':');
      return new Tile(tileBits[0], tileBits[1], tileBits[2]);
    });
    return new MapTile(xy, tiles, levelBits);
  })
  .filter(function(mapTile) {
    if (mapTile == null) {
      return false;
    }
    return true;
  })
  .join(function(mapTiles) {
    console.log(mapTiles.length);
    /*mapTiles.forEach(function(mapTile) {
      console.log(mapTile);
    });*/
    var myMap = new RpgMap(srcFilename, 2, 16, mapTiles);
    var writer = fs.createWriteStream('maps/' + srcFilename + '.map.json');
    writer.on('finish', function () {
      console.log("DONE");
    });
    writer.write(JSON.stringify(myMap) + '\n', 'utf-8');
    writer.end();
  });
