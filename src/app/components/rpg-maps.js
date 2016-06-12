var TileSets = require('./tile-sets.js'),
    config = require('../config.js'),
    drawTile = require('../utils.js').drawTile;

var TileSetService = TileSets.TileSetService;

const rpgMapsApi = config.rpgMapsApi,
      tileSize = config.tileSize;

const baseTiles = config.baseTileColours.map(
  colour => {
    var tileCanvas = document.createElement("canvas");
    tileCanvas.width = tileSize;
    tileCanvas.height = tileSize;
    var ctx = tileCanvas.getContext('2d');
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, tileSize, tileSize);
    return tileCanvas;
  }
);

/* =============================================================================
 * CLASS: RPG MAP SERVICE
 * =============================================================================
 * Encapsulates the loading and saving of RpgMaps to/from the maps API.
 * =============================================================================
 */
class RpgMapService {
  loadMaps(callback) {
    $.ajax({
      url: rpgMapsApi,
      dataType: 'json',
      cache: false,
      success: data => {
        callback({ maps: data });
      },
      error: (xhr, status, err) => {
        // console.error(rpgMapsApi, status, err.toString());
        callback(this.handleLoadError(xhr));
      }
    });
  }

  loadMap(mapId, callback) {
    console.log("Loading map [" + mapId + "]");
    var mapUrl = rpgMapsApi + "/" + mapId;
    $.ajax({
      url: mapUrl,
      dataType: 'json',
      cache: false,
      success: data => {
        this.initRpgMap(data, callback);
      },
      error: (xhr, status, err) => {
        // console.error(mapUrl, status, err.toString());
        callback(this.handleLoadError(xhr));
      }
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
      if (data.code == 11000) {
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
      rows,
      cols,
      mapTiles: []
    };
    this.initRpgMap(data, callback);
  }

  initRpgMap(rpgMapDef, callback) {
    var tileSetMappings = new Map();
    rpgMapDef.mapTiles.forEach(mapTileDef => {
      mapTileDef.tiles.forEach(
        tileDef => tileSetMappings.set(tileDef.tileSet, null)
      );
    });
    if (tileSetMappings.size == 0) {
      // no tilesets to load - either a new or empty map
      callback({ map: this.buildRpgMap(tileSetMappings, rpgMapDef) });
      return;
    }
    tileSetMappings.forEach((value, key) => {
      var tileSetService = new TileSetService();
      tileSetService.loadTileSet("tileset?name=" + key, data => {
        this.tileSetLoaded(key, data, tileSetMappings, rpgMapDef, callback);
      });
    });
  }

  tileSetLoaded(key, data, tileSetMappings, rpgMapDef, callback) {
    if (data.tileSet) {
      var tileSet = data.tileSet;
      console.log("> Tileset loaded: " + tileSet.getName());
      tileSetMappings.set(tileSet.getName(), tileSet);
      var allTileSetsLoaded = [...tileSetMappings.values()].every(
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
    return { name, rows, cols, mapTiles };
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
    this.initImageData();
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

  addMaskTile(maskTile) {
    this._maskTiles.push(maskTile);
    this.initImageData();
  }

  setLevels(levels) {
    this._levels = levels;
  }

  addLevel(level) {
    this._levels.push(level);
  }

  sendToBack() {
    var topTile = this._maskTiles.pop();
    this._maskTiles.unshift(topTile);
    this.initImageData();
  }

  keepTop() {
    var topTile = this._maskTiles.pop();
    this._maskTiles = [topTile];
    this.initImageData();
  }

  clear() {
    this._maskTiles = [];
    this.initImageData();
  }

  copy() {
    return new MapTile(
      this._baseTileCanvas,
      this._maskTiles.slice(0),
      this._levels.slice(0)
    );
  }

  getDto(x, y) {
    if (this._maskTiles) {
      return {
        xy: [x, y],
        tiles: this._maskTiles.map(maskTile => {
          return maskTile.getDto();
        }),
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

  getDto() {
    return {
      tileSet: this._tile.getTileSetName(),
      tile: this._tile.getTileName(),
      maskLevel: this._maskLevel
    }
  }
}

module.exports = {
  RpgMapService,
  MaskTile
};
