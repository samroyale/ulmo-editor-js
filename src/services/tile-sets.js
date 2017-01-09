import $ from 'jquery';
import Q from 'q';
import { getDrawingContext, loadImage } from '../utils';
import { tileSetsApi, tilesImgPath, tileSize } from '../config';

var instance = null;

/* =============================================================================
 * CLASS: TILE
 * =============================================================================
 * This class should be immutable since the same instance is used across
 * multiple maskTiles.
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
 * CLASS: TILE SET SERVICE
 * =============================================================================
 * Encapsulates the loading of TileSets from the tile sets API.
 * =============================================================================
 */
class TileSetService {
  constructor() {
    if (!instance) {
      instance = this;
      this.cache = {};
      this.nameToIdMappings = {};
    }
    return instance;
  }

  loadTileSets() {
    var deferred = Q.defer();
    var p = Q($.get(tileSetsApi).promise());
    p.then(
      data => deferred.resolve({ tileSets: data }),
      xhr => deferred.reject(this.handleError(xhr))
    );
    return deferred.promise;
  }

  loadTileSetByName(name, progressCallback) {
    if (this.nameToIdMappings[name]) {
      return this.loadTileSet(this.nameToIdMappings[name], progressCallback);
    }
    var deferred = Q.defer();
    var tileSetUrl = tileSetsApi + "/tileset?name=" + name;
    var p = Q($.get(tileSetUrl).promise());
    p.then(data => {
      this.cache[data.id] = deferred;
      this.nameToIdMappings[name] = data.id;
      this.initTileSet(data, deferred, progressCallback);
    }, xhr => {
      deferred.reject(this.handleError(xhr, name));
    });
    return deferred.promise;
  }

  loadTileSet(tileSetId, progressCallback) {
    if (this.cache[tileSetId]) {
      return this.cache[tileSetId].promise;
    }
    var deferred = Q.defer();
    var tileSetUrl = tileSetsApi + "/" + tileSetId;
    var p = Q($.get(tileSetUrl).promise());
    p.then(data => {
      this.cache[tileSetId] = deferred;
      this.nameToIdMappings[data.name] = tileSetId;
      this.initTileSet(data, deferred, progressCallback);
    }, xhr => {
      deferred.reject(this.handleError(xhr, tileSetId));
    });
    return deferred.promise;
  }

  handleError(xhr, id) {
    var data = xhr.responseJSON;
    if (data) {
      // known errors go here
      return { err: data.err, status: xhr.status, id: id };
    }
    return { err: xhr.statusText, status: xhr.status, id: id };
  }

  initTileSet(tileSetDef, deferred, progressCallback) {
    var tilesImageUrl = tilesImgPath + "/" + tileSetDef.image;
    loadImage(tilesImageUrl, data => {
      if (data.err) {
        deferred.reject({ err: data.err, id: tileSetDef.name });
        return;
      }
      deferred.resolve({ tileSet: this.buildTileSet(tileSetDef, data.img, progressCallback) });
    });
  }

  buildTileSet(tileSetDef, tileSetImage, progressCallback) {
    var tiles = this.initTiles(tileSetDef, tileSetImage);
    progressCallback(100);
    return new TileSet(tileSetDef.id, tileSetDef.name, tiles);
  }

  initTiles(tileSetDef, tileSetImage) {
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

export default TileSetService;
