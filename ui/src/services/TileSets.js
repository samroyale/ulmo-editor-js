import { getDrawingContext, loadImage } from '../utils';
import { tileSetsApi, tilesImgPath, tileSize } from '../config';

var instance = null;

/* =============================================================================
 * CLASS: TILE
 * =============================================================================
 * This class should be immutable since the same instance is used across
 * multiple MaskTiles.
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

  getTileSetName = () => {
    return this._tileSetName;
  };

  getTileName = () => {
    return this._tileName;
  };

  getImage = () => {
    return this._imageData;
  };

  getCanvas = () => {
    return this._canvas;
  };
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

  getId = () => {
    return this._id;
  };

  getName = () => {
    return this._name;
  };

  getTile = (x, y) => {
    return this._tiles[x][y];
  };

  getTileByName = name => {
    return this._tileNameMappings[name];
  };

  getCols = () => {
    return this._tiles.length;
  };

  getRows = () => {
    return this._tiles[0].length;
  };
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

  loadTileSets = async () => {
    try {
      const response = await fetch(tileSetsApi, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      return { tileSets: json };
    }
    catch(e) {
      throw new Error(`Could not load tilesets [${e.message}]`);
    }
  };

  loadTileSetByName = async (name) => {
    if (this.nameToIdMappings[name]) {
      return this.loadTileSet(this.nameToIdMappings[name]);
    }
    try {
      const response = await fetch(`${tileSetsApi}/withName/${name}`, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      const img = await loadImage(`${tilesImgPath}/${json.image}`);
      const tileSet = this._buildTileSet(json, img);
      return this.cacheAndReturn(tileSet);
    }
    catch (e) {
      throw new Error(`Could not load tileset [${e.message}]`);
    }
  };

  loadTileSet = async (tileSetId) => {
    if (this.cache[tileSetId]) {
      return { tileSet: this.cache[tileSetId] };
    }
    try {
      const response = await fetch(`${tileSetsApi}/${tileSetId}`, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      const img = await loadImage(`${tilesImgPath}/${json.image}`);
      const tileSet = this._buildTileSet(json, img);
      return this.cacheAndReturn(tileSet);
    }
    catch (e) {
      throw new Error(`Could not load tileset [${e.message}]`);
    }
  };

  cacheAndReturn(tileSet) {
    const tileSetId = tileSet.getId();
    this.cache[tileSetId] = tileSet;
    this.nameToIdMappings[tileSet.getName()] = tileSetId;
    return { tileSet: tileSet };
  }

  _buildTileSet = (data, { img }) => {
    var tiles = this._initTiles(data, img);
    // deferred.notify(100);
    return new TileSet(data.id, data.name, tiles);
  };

  _initTiles = (tileSetDef, tileSetImage) => {
    const tileDefKey = (x, y) => x + "-" + y;

    const tileDefMappings = tileSetDef.tiles.reduce((map, tileDef) => {
      map[tileDefKey(tileDef.xy[0], tileDef.xy[1])] = tileDef;
      return map;
    }, {});

    // draw tileSet image to canvas and scale it x2
    const tileSetCanvas = document.createElement("canvas");
    tileSetCanvas.width = tileSetImage.width * 2;
    tileSetCanvas.height = tileSetImage.height * 2;
    const ctx = getDrawingContext(tileSetCanvas);
    ctx.drawImage(tileSetImage, 0, 0, tileSetCanvas.width, tileSetCanvas.height);
    // extract tiles and store them in a 2D array
    const cols = Math.floor(tileSetCanvas.width / tileSize);
    const rows = Math.floor(tileSetCanvas.height / tileSize);
    const tiles = new Array(cols);
    for (var x = 0; x < cols; x++) {
      tiles[x] = new Array(rows);
      for (var y = 0; y < rows; y++) {
        const tileCanvas = document.createElement("canvas");
        tileCanvas.width = tileSize;
        tileCanvas.height = tileSize;
        const tileCtx = tileCanvas.getContext('2d');
        const tileImageData = ctx.getImageData(x * tileSize, y * tileSize,
            tileSize, tileSize);
        tileCtx.putImageData(tileImageData, 0, 0);
        const tileDef = tileDefMappings[tileDefKey(x, y)];
        if (tileDef) {
          tiles[x][y] = new Tile(tileSetDef.name, tileDef.name, tileCanvas);
        }
      }
    }
    return tiles;
  };
}

export default TileSetService;
