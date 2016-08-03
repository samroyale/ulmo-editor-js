var TileSetService = require('./tile-sets.js'),
    config = require('../config.js'),
    drawTile = require('../utils.js').drawTile,
    initTile = require('../utils.js').initTile;

const rpgMapsApi = config.rpgMapsApi,
      tileSize = config.tileSize;

const baseTiles = config.baseTileColours.map(
  colour => initTile(colour)
);

const tileSetService = new TileSetService();

/* =============================================================================
 * CLASS: RPG MAP SERVICE
 * =============================================================================
 * Encapsulates the loading and saving of RpgMaps to/from the maps API.
 * =============================================================================
 */
class RpgMapService {
  loadMaps(callback) {
    var rpgMaps = $.ajax({
      url: rpgMapsApi,
      dataType: 'json',
      cache: false
    }).promise();
    rpgMaps.done(data => {
      callback({ maps: data });
    }).fail((xhr, status, err) => {
      // console.error(tileSetsApi, status, err.toString());
      callback(this.handleLoadError(xhr));
    });
  }

  loadMap(mapId, callback) {
    console.log("Loading map [" + mapId + "]");
    var mapUrl = rpgMapsApi + "/" + mapId;
    var rpgMap = $.ajax({
      url: mapUrl,
      dataType: 'json',
      cache: false
    }).promise();
    rpgMap.done(data => {
      this.initRpgMap(data, callback);
    }).fail((xhr, status, err) => {
      // console.error(tileSetsApi, status, err.toString());
      callback(this.handleLoadError(xhr));
    });
  }

  handleLoadError(xhr) {
    var data = xhr.responseJSON;
    if (data) {
      // known errors go here
      return { err: data.err, status: xhr.status };
    }
    return { err: xhr.statusText, status: xhr.status };
  }

  saveMap(rpgMap, callback) {
    var mapUrl = rpgMapsApi + "/" + rpgMap.getId();
    this.doSave(mapUrl, "PUT", rpgMap, rpgMap.getDto(), callback);
  }

  saveMapAs(rpgMap, mapName, callback) {
    this.doSave(rpgMapsApi, "POST", rpgMap, rpgMap.getDtoWithName(mapName), callback);
  }

  doSave(mapUrl, reqType, rpgMap, mapDef, callback) {
    console.log("Saving map [" + reqType + " " + mapUrl + "]");
    $.ajax({
      type: reqType,
      url: mapUrl,
      dataType: 'json',
      data: mapDef,
      success: data => {
        callback(this.mapSaved(rpgMap, mapDef, data));
      },
      error: (xhr, status, err) => {
        // console.error(mapUrl, status, err.toString());
        callback(this.handleSaveError(mapDef, xhr));
      }
    });
  }

  mapSaved(rpgMap, mapDef, data) {
    console.log(data.message);
    rpgMap.setId(data.mapId);
    rpgMap.setName(mapDef.name);
    return {
      message: data.message,
      mapId: rpgMap.getId(),
      mapName: rpgMap.getName()
    };
  }

  handleSaveError(mapDef, xhr) {
    var data = xhr.responseJSON;
    if (data) {
      // known errors go here
      console.log(data.err);
      if (data.code === 11000) {
        return {
          err: "Map name already in use: " + mapDef.name,
          status: xhr.status
        };
      }
      return { err: data.err, status: xhr.status };
    }
    return { err: xhr.statusText, status: xhr.status };
  }

  newMap(rows, cols, callback) {
    var data = {
      rows: rows,
      cols: cols,
      mapTiles: []
    };
    this.initRpgMap(data, callback);
  }

  resizeMap(rpgMap, left, right, top, bottom, callback) {
    var newRows = rpgMap.getRows() + top + bottom;
    var newCols = rpgMap.getCols() + left + right;
    this.newMap(newRows, newCols, data => {
      var newRpgMap = data.map;
      newRpgMap.resize(rpgMap, left, right, top, bottom);
      callback({ map: newRpgMap })
    });
  }

  initRpgMap(rpgMapDef, callback) {
    var tileSetMappings = new Map();
    rpgMapDef.mapTiles.forEach(mapTileDef => {
      mapTileDef.tiles.forEach(
        tileDef => tileSetMappings.set(tileDef.tileSet, null)
      );
    });
    if (tileSetMappings.size === 0) {
      // no tilesets to load - either a new or empty map
      callback({ map: this.buildRpgMap(tileSetMappings, rpgMapDef) });
      return;
    }
    tileSetMappings.forEach((value, key) => {
      tileSetService.loadTileSetByName(key, data => {
        this.tileSetLoaded(key, data, tileSetMappings, rpgMapDef, callback);
      });
    });
  }

  tileSetLoaded(key, data, tileSetMappings, rpgMapDef, callback) {
    if (data.tileSet) {
      var tileSet = data.tileSet;
      console.log("> Tileset loaded: " + tileSet.getName());
      tileSetMappings.set(tileSet.getName(), tileSet);
      var allTileSetsLoaded = Array.from(tileSetMappings.values()).every(
        val => val != null
      );
      if (allTileSetsLoaded) {
        callback({ map: this.buildRpgMap(tileSetMappings, rpgMapDef) });
      }
      return;
    }
    if (data.err) {
      callback({
        err: "Could not load tileset '" + key + "' : " + data.err,
        status: data.status
      });
      return;
    }
    console.log("Something went wrong...");
  }

  buildRpgMap(tileSetMappings, rpgMapDef) {
    // console.log("buildRpgMap: " + tileSetMappings.size);
    return new RpgMap(
      rpgMapDef.id,
      rpgMapDef.name,
      this.initMapTiles(tileSetMappings, rpgMapDef)
    );
  }

  initMapTiles(tileSetMappings, rpgMapDef) {
    var tileDefKey = (x, y) => x + "-" + y;
    var tileDefMappings = {};
    rpgMapDef.mapTiles.forEach(mapTileDef => {
      var key = tileDefKey(mapTileDef.xy[0], mapTileDef.xy[1]);
      tileDefMappings[key] = mapTileDef;
    });
    var rows = rpgMapDef.rows, cols = rpgMapDef.cols;
    var tiles = new Array(cols);
    for (var x = 0; x < cols; x++) {
      tiles[x] = new Array(rows);
      for (var y = 0; y < rows; y++) {
        var mapTileDef = tileDefMappings[tileDefKey(x, y)];
        var baseCanvas = baseTiles[(x + y) % baseTiles.length];
        if (mapTileDef) {
          var maskTiles = mapTileDef.tiles.map(tileDef => {
            var tile = tileSetMappings.get(tileDef.tileSet).getTileByName(tileDef.tile);
            return new MaskTile(tile, tileDef.maskLevel);
          });
          tiles[x][y] = new MapTile(baseCanvas, maskTiles, mapTileDef.levels);
        }
        else {
          tiles[x][y] = new MapTile(baseCanvas);
        }
      }
    }
    return tiles;
  }
}

/* =============================================================================
 * CLASS: RPG MAP
 * -----------------------------------------------------------------------------
 * The model representing a map of tiles.
 * =============================================================================
 */
class RpgMap {
  constructor(id, name, mapTiles) {
    this._id = id;
    this._name = name;
    this._mapTiles = mapTiles;
  }

  getId() {
    return this._id;
  }

  setId(id) {
    this._id = id;
  }

  getName() {
    return this._name;
  }

  setName(name) {
    this._name = name;
  }

  getMapTile(x, y) {
    return this._mapTiles[x][y];
  }

  putMapTile(x, y, mapTile) {
    this._mapTiles[x][y] = mapTile;
  }

  getCols() {
    return this._mapTiles.length;
  }

  getRows() {
    return this._mapTiles[0].length;
  }

  cut(topLeft, rows, cols) {
    var tiles = this.copy(topLeft, rows, cols);
    this.clear(topLeft, rows, cols);
    return tiles;
  }

  copy(topLeft, rows, cols) {
    var tiles = new Array(cols);
    var x = topLeft.x, y = topLeft.y;
    for (var i = 0; i < cols; i++) {
      tiles[i] = new Array(rows);
      for (var j = 0; j < rows; j++) {
        tiles[i][j] = this._mapTiles[x + i][y + j].copy();
      }
    }
    return tiles;
  }

  paste(x, y, tiles) {
    var xBound = Math.min(x + tiles.length, this.getCols());
    var yBound = Math.min(y + tiles[0].length, this.getRows());
    for (var i = x; i < xBound; i++) {
      for (var j = y; j < yBound; j++) {
        var tile = tiles[i - x][j - y].copy();
        var mapTile = this._mapTiles[i][j];
        mapTile.setLevels(tile.getLevels());
        mapTile.setMaskTiles(tile.getMaskTiles());
      }
    }
    return {x: xBound - 1, y: yBound - 1};
  }

  resize(rpgMap, left, right, top, bottom) {
    var topLeft = {
      x: 0 - Math.min(0, left),
      y: 0 - Math.min(0, top)
    }
    var rows = rpgMap.getRows() - topLeft.y;
    var cols = rpgMap.getCols() - topLeft.x;
    var tiles = rpgMap.copy(topLeft, rows, cols);
    this.paste(Math.max(0, left), Math.max(0, top), tiles);
  }

  sendToBack(topLeft, rows, cols) {
    this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.sendToBack()
    );
  }

  keepTop(topLeft, rows, cols) {
    this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.keepTop()
    );
  }

  clear(topLeft, rows, cols) {
    this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.clear()
    );
  }

  addAsMaskTile(topLeft, rows, cols, tile) {
    this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.addAsMaskTile(tile)
    );
  }

  insertAsMaskTile(topLeft, rows, cols, tile) {
    this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.insertAsMaskTile(tile)
    );
  }

  setLevels(topLeft, rows, cols, levels) {
    this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.setLevels(levels)
    );
  }

  setMaskTiles(x, y, maskTiles) {
    this._mapTiles[x][y].setMaskTiles(maskTiles);
  }

  doStuff(topLeft, rows, cols, func) {
    for (var i = topLeft.x; i < topLeft.x + cols; i++) {
      for (var j = topLeft.y; j < topLeft.y + rows; j++) {
        func(this._mapTiles[i][j]);
      }
    }
  }

  getDto() {
    return this.getDtoWithName(this._name);
  }

  getDtoWithName(name) {
    var rows = this.getRows(), cols = this.getCols();
    var mapTiles = [];
    for (var x = 0; x < cols; x++) {
      for (var y = 0; y < rows; y++) {
        var mapTile = this._mapTiles[x][y].getDto(x, y);
        if (mapTile) {
          mapTiles.push(mapTile)
        }
      }
    }
    return { name: name, rows: rows, cols: cols, mapTiles: mapTiles };
  }
}

/* =============================================================================
 * CLASS: MAP TILE
 * -----------------------------------------------------------------------------
 * The relationship between tiles is MapTile ->* MaskTile -> Tile
 * =============================================================================
 */
class MapTile {
  constructor(baseTileCanvas, maskTiles, levels) {
    this._baseTileCanvas = baseTileCanvas;
    this._maskTiles = maskTiles ? maskTiles : [];
    this._levels = levels ? levels : [];
    if (baseTileCanvas) {
      this.initImageData();
    }
  }

  initImageData() {
    var tileCanvas = drawTile(this._maskTiles, this._baseTileCanvas);
    var ctx = tileCanvas.getContext('2d');
    this._imageData = ctx.getImageData(0, 0, tileCanvas.width, tileCanvas.height);
  }

  getMaskTiles() {
    return this._maskTiles;
  }

  getLevels() {
    return this._levels;
  }

  getImage() {
    return this._imageData;
  }

  setMaskTiles(maskTiles) {
    this._maskTiles = maskTiles;
    this.initImageData();
  }

  addAsMaskTile(tile) {
    this._maskTiles.push(new MaskTile(tile));
    this.initImageData();
  }

  insertAsMaskTile(tile) {
    this._maskTiles = [];
    this._maskTiles.push(new MaskTile(tile));
    this.initImageData();
  }

  setLevels(levels) {
    this._levels = levels;
  }

  addLevel(level) {
    this._levels.push(level);
  }

  sendToBack() {
    if (this._maskTiles.length < 2) {
      return;
    }
    var topTile = this._maskTiles.pop();
    this._maskTiles.unshift(topTile);
    this.initImageData();
  }

  keepTop() {
    if (this._maskTiles.length < 2) {
      return;
    }
    var topTile = this._maskTiles.pop();
    this._maskTiles = [topTile];
    this.initImageData();
  }

  clear() {
    if (this._maskTiles.length === 0) {
      return;
    }
    this._maskTiles = [];
    this.initImageData();
  }

  copy() {
    return new MapTile(
      null,
      this._maskTiles.map(maskTile =>
        maskTile.copy()
      ),
      this._levels.slice(0)
    );
  }

  getDto(x, y) {
    if (this._maskTiles) {
      return {
        xy: [x, y],
        tiles: this._maskTiles.map(maskTile =>
          maskTile.getDto()
        ),
        levels: this._levels
      }
    }
    return null;
  }
}

/* =============================================================================
 * CLASS: MASK TILE
 * -----------------------------------------------------------------------------
 * Simple wrapper for a standard tile that adds masking information.
 * =============================================================================
 */
class MaskTile {
  constructor(tile, maskLevel) {
    this._tile = tile; // standard tile
    this._maskLevel = maskLevel; // string
  }

  getTile() {
    return this._tile;
  }

  getMaskLevel() {
    return this._maskLevel;
  }

  setMaskLevel(maskLevel) {
    this._maskLevel = maskLevel;
  }

  copy() {
    return new MaskTile(this._tile, this._maskLevel);
  }

  getDto() {
    return {
      tileSet: this._tile.getTileSetName(),
      tile: this._tile.getTileName(),
      maskLevel: this._maskLevel
    }
  }
}

module.exports = RpgMapService;
