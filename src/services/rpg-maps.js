import $ from 'jquery';
import Q from 'q';
import TileSetService from './tile-sets';
import { drawTile, initTile } from '../utils';
import { rpgMapsApi, baseTileColours } from '../config';

const baseTiles = baseTileColours.map(
  colour => initTile(colour)
);

const tileSetService = new TileSetService();

var instance = null;

/* =============================================================================
 * CLASS: CLIPBOARD
 * =============================================================================
 */
class Clipboard {
  constructor(tiles) {
    this._tiles = tiles;
  }

  setTiles(tiles) {
    this._tiles = tiles;
  }

  getTiles() {
    return this._tiles;
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
 * CLASS: SPRITE
 * -----------------------------------------------------------------------------
 * The relationship between tiles is MapTile ->* MaskTile -> Tile
 * =============================================================================
 */
class Sprite {
  constructor(type, level, location) {
    this._type = type;
    this._level = level
    // location is an array of xy values
    this._location = location;
  }

  getType() {
    return this._type;
  }

  getLevel() {
    return this._level;
  }

  getLocation() {
    return this._location;
  }

  getDto() {
    return {
      type: this._type,
      level: this._level,
      location: this._location
    }
  }
}

/* =============================================================================
 * CLASS: RPG MAP
 * -----------------------------------------------------------------------------
 * The model representing a map of tiles. There is a contract here that any
 * mutator function must return a snapshot of the mutated tiles BEFORE they are
 * changed. The only exception is the restoreTiles method which is used by undo
 * to return the tiles to their original state.
 * =============================================================================
 */
class RpgMap {
  constructor(id, name, mapTiles, sprites) {
    this._id = id;
    this._name = name;
    this._mapTiles = mapTiles;
    this._sprites = sprites;
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

  getSprites() {
    return this._sprites;
  }

  setSprites(sprites) {
    this._sprites = sprites;
  }

  getCols() {
    return this._mapTiles.length;
  }

  getRows() {
    return this._mapTiles[0].length;
  }

  cutTiles(topLeft, rows, cols, clipboard) {
    this.copyTiles(topLeft, rows, cols, clipboard);
    return this.clear(topLeft, rows, cols);
  }

  copyTiles(topLeft, rows, cols, clipboard) {
    clipboard.setTiles(this._copyInternal(topLeft.x, topLeft.y, rows, cols));
    return null;
  }

  _copyInternal(x, y, rows, cols) {
    var tiles = new Array(cols);
    for (var i = 0; i < cols; i++) {
      tiles[i] = new Array(rows);
      for (var j = 0; j < rows; j++) {
        tiles[i][j] = this._mapTiles[x + i][y + j].copy();
      }
    }
    return tiles;
  }

  pasteTiles(topLeft, clipboard) {
    return this._pasteTilesInternal(topLeft.x, topLeft.y, clipboard.getTiles());
  }

  _pasteTilesInternal(x, y, tiles) {
    var xBound = Math.min(tiles.length, this.getCols() - x);
    var yBound = Math.min(tiles[0].length, this.getRows() - y);
    var oldTiles = this._copyInternal(x, y, yBound, xBound);
    for (var i = 0; i < xBound; i++) {
      for (var j = 0; j < yBound; j++) {
        this.applyTile(
          this._mapTiles[i + x][j + y],
          tiles[i][j].copy()
        );
      }
    }
    return oldTiles;
  }

  restoreTiles(topLeft, tiles) {
    var x = topLeft.x, y = topLeft.y;
    var xBound = tiles.length, yBound = tiles[0].length;
    for (var i = 0; i < xBound; i++) {
      for (var j = 0; j < yBound; j++) {
        this.applyTile(
          this._mapTiles[i + x][j + y],
          tiles[i][j]
        );
      }
    }
    return {x: xBound + x - 1, y: yBound + y - 1};
  }

  applyTile(mapTile, tile) {
    mapTile.setLevels(tile.getLevels());
    mapTile.setMaskTiles(tile.getMaskTiles());
  }

  resize(rpgMap, left, right, top, bottom) {
    var topLeft = {
      x: 0 - Math.min(0, left),
      y: 0 - Math.min(0, top)
    }
    var rows = rpgMap.getRows() - topLeft.y;
    var cols = rpgMap.getCols() - topLeft.x;
    this._pasteTilesInternal(Math.max(0, left), Math.max(0, top),
        rpgMap._copyInternal(topLeft.x, topLeft.y, rows, cols));
  }

  sendToBack(topLeft, rows, cols) {
    return this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.sendToBack()
    );
  }

  keepTop(topLeft, rows, cols) {
    return this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.keepTop()
    );
  }

  clear(topLeft, rows, cols) {
    return this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.clear()
    );
  }

  addAsMaskTile(topLeft, rows, cols, tile) {
    return this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.addAsMaskTile(tile)
    );
  }

  insertAsMaskTile(topLeft, rows, cols, tile) {
    return this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.insertAsMaskTile(tile)
    );
  }

  setLevels(topLeft, rows, cols, levels) {
    return this.doStuff(topLeft, rows, cols, mapTile =>
      mapTile.setLevels(levels)
    );
  }

  setMaskTiles(x, y, maskTiles) {
    var oldTile = this._mapTiles[x][y].copy();
    this._mapTiles[x][y].setMaskTiles(maskTiles);
    return [[oldTile]];
  }

  doStuff(topLeft, rows, cols, func) {
    var oldTiles = new Array(cols);
    for (var i = 0; i < cols; i++) {
      oldTiles[i] = new Array(rows);
      for (var j = 0; j < rows; j++) {
        var mapTile = this._mapTiles[i + topLeft.x][j + topLeft.y];
        oldTiles[i][j] = mapTile.copy();
        func(mapTile);
      }
    }
    return oldTiles;
  }

  copy() {
    return new RpgMap(
      this._id,
      this._name,
      this._copyInternal(0, 0, this.getRows(), this.getCols())
    );
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
    var sprites = this._sprites.map(sprite => sprite.getDto());
    return {
      name: name,
      rows: rows,
      cols: cols,
      mapTiles: mapTiles,
      sprites: sprites
    };
  }
}

/* =============================================================================
 * CLASS: RPG MAP SERVICE
 * =============================================================================
 * Encapsulates the loading and saving of RpgMaps to/from the maps API.
 * =============================================================================
 */
class RpgMapService {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  loadMaps() {
    var deferred = Q.defer();
    var p = Q($.ajax({
      url: rpgMapsApi,
      dataType: 'json',
      cache: false
    }).promise());
    p.then(
      data => deferred.resolve({ maps: data }),
      xhr => deferred.reject(this.handleLoadError(xhr))
    ).done();
    return deferred.promise;
  }

  loadMap(mapId) {
    console.log("Loading map [" + mapId + "]");
    var deferred = Q.defer();
    var mapUrl = rpgMapsApi + "/" + mapId;
    var p = Q($.ajax({
      url: mapUrl,
      dataType: 'json',
      cache: false
    }).promise());
    p.then(
      data => this.initRpgMap(data, deferred),
      xhr => deferred.reject(this.handleLoadError(xhr))
    ).done();
    return deferred.promise;
  }

  handleLoadError(xhr) {
    var data = xhr.responseJSON;
    if (data) {
      // known errors go here
      return { err: data.err, status: xhr.status };
    }
    return { err: xhr.statusText, status: xhr.status };
  }

  saveMap(rpgMap) {
    var mapUrl = rpgMapsApi + "/" + rpgMap.getId();
    return this.doSave(mapUrl, "PUT", rpgMap, rpgMap.getDto());
  }

  saveMapAs(rpgMap, mapName) {
    return this.doSave(rpgMapsApi, "POST", rpgMap, rpgMap.getDtoWithName(mapName));
  }

  doSave(mapUrl, reqType, rpgMap, mapDef) {
    console.log("Saving map [" + reqType + " " + mapUrl + "]");
    var deferred = Q.defer();
    var p = Q($.ajax({
      type: reqType,
      url: mapUrl,
      dataType: 'json',
      data: mapDef,
    }).promise());
    p.then(
      data => deferred.resolve(this.mapSaved(rpgMap, mapDef, data)),
      xhr => deferred.reject(this.handleSaveError(mapDef, xhr))
    ).done();
    return deferred.promise;
  }

  mapSaved(rpgMap, mapDef, data) {
    // console.log(data.message);
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
          err: "Name already in use [" + mapDef.name + "]",
          status: xhr.status
        };
      }
      if (data.err) {
        return { err: data.err, status: xhr.status };
      }
      if (data.message) {
        return { err: data.message, status: xhr.status };
      }
    }
    return { err: xhr.statusText, status: xhr.status };
  }

  newMap(rows, cols) {
    var data = {
      rows: rows,
      cols: cols,
      mapTiles: []
    };
    var deferred = Q.defer();
    this.initRpgMap(data, deferred, function() {});
    return deferred.promise;
  }

  resizeMap(rpgMap, left, right, top, bottom) {
    var newRows = rpgMap.getRows() + top + bottom;
    var newCols = rpgMap.getCols() + left + right;
    var newMap = this.newMap(newRows, newCols);
    return newMap.then(data => {
      var newRpgMap = data.map;
      newRpgMap.resize(rpgMap, left, right, top, bottom);
      return { map: newRpgMap, oldMap: rpgMap };
    });
  }

  initRpgMap(rpgMapDef, deferred) {
    var progress = 0;
    deferred.notify(progress += 20);
    // var tileSetPromises = this.tileSetPromises(rpgMapDef, (percent) => {
    //   var increment = progress < 80 ? percent / 10 : 0;
    //   progressCallback(progress += increment);
    // });
    var tileSetPromises = this.tileSetPromises(rpgMapDef);
    if (tileSetPromises.size === 0) {
      // no tilesets to load - either a new or empty map
      deferred.notify(80);
      deferred.resolve({ map: this.buildRpgMap({}, rpgMapDef, deferred) });
      return;
    }
    // wait for all tilesets to load and then continue
    var tileSets = {};
    Q.all(tileSetPromises).then(values => {
      deferred.notify(80);
      values.forEach(value => {
        tileSets[value.tileSet.getName()] = value.tileSet;
      });
      deferred.resolve({ map: this.buildRpgMap(tileSets, rpgMapDef, deferred) });
    }, value => {
      deferred.reject(this.tileSetLoadErr(value));
    }, percent => {
      var increment = progress < 80 ? percent / 10 : 0;
      deferred.notify(progress += increment);
    }).done();
  }

  /*
   * Returns an array of tileset promises representing the tilesets used in the given map definition.
   */
  tileSetPromises(rpgMapDef) {
    var tileSets = new Map();
    rpgMapDef.mapTiles.forEach(mapTileDef => {
      mapTileDef.tiles.forEach(tileDef => {
        var tsName = tileDef.tileSet;
        if (!tileSets.has(tsName)) {
          tileSets.set(tsName, tileSetService.loadTileSetByName(tsName));
        }
      });
    });
    return Array.from(tileSets.values());
  }

  tileSetLoadErr(data) {
    if (data.err) {
      return {
        err: "Could not load tileset '" + data.id + "' : " + data.err,
        status: data.status
      };
    }
    console.log("Something went wrong...");
  }

  buildRpgMap(tileSets, rpgMapDef, deferred) {
    // console.log("buildRpgMap: " + tileSetMappings.size);
    var mapTiles = this.initMapTiles(tileSets, rpgMapDef);
    var sprites = this.initSprites(rpgMapDef);
    deferred.notify(100);
    return new RpgMap(rpgMapDef.id, rpgMapDef.name, mapTiles, sprites);
  }

  initMapTiles(tileSets, rpgMapDef) {
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
            var tile = tileSets[tileDef.tileSet].getTileByName(tileDef.tile);
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

  initSprites(rpgMapDef) {
    return rpgMapDef.sprites.map(spriteDef =>
      new Sprite(spriteDef.type, spriteDef.level, spriteDef.location)
    )
  }

  /*
   * So map canvas doesn't need to know anything about clipboards.
   */
  emptyClipboard() {
    return new Clipboard();
  }
}

export default RpgMapService;
