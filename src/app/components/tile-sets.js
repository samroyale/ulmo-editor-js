var TileSets = require('./tile-sets.js'),
    config = require('../config.js'),
    getDrawingContext = require('../utils.js').getScalableDrawingContext;

const tileSetsApi = config.tileSetsApi,
      tileSize = config.tileSize;

/* =============================================================================
 * CLASS: TILE SET SERVICE
 * =============================================================================
 * Encapsulates the loading of TileSets from the tile sets API.
 * =============================================================================
 */
class TileSetService {
  loadTileSets(callback) {
    $.ajax({
      url: tileSetsApi,
      dataType: 'json',
      cache: false,
      success: data => {
        callback({ tileSets: data });
      },
      error: (xhr, status, err) => {
        // console.error(tileSetsApi, status, err.toString());
        callback(this.handleError(xhr));
      }
    });
  }

  loadTileSet(tileSetId, callback) {
    var tileSetUrl = tileSetsApi + "/" + tileSetId;
    $.ajax({
      url: tileSetUrl,
      dataType: 'json',
      cache: true,
      success: data => {
        this.initTileSet(data, callback);
      },
      error: (xhr, status, err) => {
        // console.error(tileSetsApi, status, err.toString());
        callback(this.handleError(xhr));
      }
    });
  }

  handleError(xhr) {
    var data = xhr.responseJSON;
    if (data) {
      // known errors go here
      return { err: data.err, status: xhr.status };
    }
    return { err: xhr.statusText, status: xhr.status };
  }

  initTileSet(tileSetDef, callback) {
    var tileSetImage = new Image();
    tileSetImage.onerror = () => {
      callback({
        err: tileSetDef.imageUrl + " failed to load"
      });
    };
    tileSetImage.onload = () => {
      callback({
        tileSet: new TileSet(
          tileSetDef.id,
          tileSetDef.name,
          this.processTileSet(tileSetDef, tileSetImage)
        )
      });
    };
    //tileSetImage.crossOrigin = "Anonymous"; // CORS
    tileSetImage.src = tileSetDef.imageUrl;
  }

  processTileSet(tileSetDef, tileSetImage) {
    // parse the tile names
    var tileDefKey = (x, y) => x + "-" + y;
    var tileDefMappings = {};
    tileSetDef.tiles.forEach(tileDef => {
      var key = tileDefKey(tileDef.xy[0], tileDef.xy[1]);
      tileDefMappings[key] = tileDef;
    });
    // draw tileSet image to canvas and scale it x2
    var tileSetCanvas = document.createElement("canvas");
    tileSetCanvas.width = tileSetImage.width * 2;
    tileSetCanvas.height = tileSetImage.height * 2;
    var ctx = getDrawingContext(tileSetCanvas);
    ctx.drawImage(tileSetImage, 0, 0, tileSetCanvas.width, tileSetCanvas.height);
    // extract tiles and store them in a 2D array
    var cols = Math.floor(tileSetCanvas.width / tileSize);
    var rows = Math.floor(tileSetCanvas.height / tileSize);
    var tiles = new Array(cols);
    for (var x = 0; x < cols; x++) {
      tiles[x] = new Array(rows);
      for (var y = 0; y < rows; y++) {
        var tileCanvas = document.createElement("canvas");
        tileCanvas.width = tileSize;
        tileCanvas.height = tileSize;
        var tileCtx = tileCanvas.getContext('2d');
        var tileImageData = ctx.getImageData(x * tileSize, y * tileSize,
            tileSize, tileSize);
        tileCtx.putImageData(tileImageData, 0, 0);
        var tileDef = tileDefMappings[tileDefKey(x, y)];
        if (tileDef) {
          tiles[x][y] = new Tile(tileSetDef.name, tileDef.name, tileCanvas);
        }
      }
    }
    return tiles;
  }
}

/* =============================================================================
 * CLASS: TILE SET
 * =============================================================================
 */
class TileSet {
  constructor(id, name, tiles) {
    this._id = id;
    this._name = name;
    this._tiles = tiles;
    this._tileNameMappings = {};
    for (var x = 0; x < this.getCols(); x++) {
      for (var y = 0; y < this.getRows(); y++) {
        if (tiles[x][y])
          this._tileNameMappings[tiles[x][y].getTileName()] = tiles[x][y];
      }
    }
  }

  getId() {
    return this._id;
  }

  getName() {
    return this._name;
  }

  getTile(x, y) {
    return this._tiles[x][y];
  }

  getTileByName(name) {
    return this._tileNameMappings[name];
  }

  getCols() {
    return this._tiles.length;
  }

  getRows() {
    return this._tiles[0].length;
  }
}

/* =============================================================================
 * CLASS: TILE
 * =============================================================================
 */
class Tile {
  constructor(tileSetName, tileName, tileCanvas) {
    this._tileSetName = tileSetName;
    this._tileName = tileName;
    this._canvas = tileCanvas;
    var ctx = this._canvas.getContext('2d');
    this._imageData = ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
  }

  getTileSetName() {
    return this._tileSetName;
  }

  getTileName() {
    return this._tileName;
  }

  getImage() {
    return this._imageData;
  }

  getCanvas() {
    return this._canvas;
  }
}

module.exports = TileSetService;
