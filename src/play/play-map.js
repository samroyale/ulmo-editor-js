import { tileSize } from '../config';

const minShuffle = {
    index1: 0,
    shuffle1: -2,
    index2: 1,
    shuffle2: 2
};

const maxShuffle = {
    index1: 1,
    shuffle1: 2,
    index2: 0,
    shuffle2: -2
};

const MIN_SHUFFLE = [0, -1, -1, 1],
      MAX_SHUFFLE = [-1, 1, 0, -1];

/* =============================================================================
 * CLASS: PLAY TILE
 * =============================================================================
 */
class PlayTile {
    constructor(mapTile) {
        this.levels = [];
        this.specialLevels = null;
        this.downLevels = null;
        this.verticals = null;
        this.horizontals = null;
        mapTile.getLevels().forEach(level => {
            var firstChar = level.toString()[0];
            if (firstChar === 'S') {
                this.addSpecialLevel(level);
                return;
            }
            if (firstChar === 'D') {
                this.addDownLevel(level);
                return;
            }
            this.addLevel(level);
        });
    }

    addLevel(levelStr) {
        this.levels.push(Number.parseInt(levelStr));
    }

    addSpecialLevel(levelStr) {
        if (!this.specialLevels) {
            this.specialLevels = new Map();
        }
        var level = Number.parseFloat(levelStr.substr(1))
        if (Number.isInteger(level)) {
            this.specialLevels.set(level, level);
            return;
        }
        this.specialLevels.set(Math.floor(level), level);
        this.specialLevels.set(Math.ceil(level), level);
    }

    addDownLevel(level) {
        if (!this.downLevels) {
            this.downLevels = new Map();
        }
        this.downLevels.set(level, level);
    }

    testValidity(level) {
        if (this.levels.includes(level)) {
            return [1, null];
        }
        var downLevel = this.getDownLevel(level);
        if (downLevel) {
            return [1, null];
        }
        var specialLevel = this.getSpecialLevel(level);
        if (specialLevel) {
            if (specialLevel === level) {
                return [1, specialLevel];
            }
            return [0, specialLevel];
        }
        return [0, null];
    }

    getSpecialLevel(level) {
        if (!this.specialLevels) {
            return null;
        }
        var specialLevel = this.specialLevels.get(level);
        if (specialLevel) {
            return specialLevel;
        }
        specialLevel = this.specialLevels.get(Math.floor(level));
        if (specialLevel) {
            return specialLevel;
        }
        specialLevel = this.specialLevels.get(Math.ceil(level));
        if (specialLevel) {
            return specialLevel;
        }
        return null;
    }

    getDownLevel(level) {
        if (!this.downLevels) {
            return null;
        }
        var downLevel = this.downLevels.get(level);
        if (downLevel) {
            return downLevel;
        }
    }

    getALevel() {
        return this.levels[0];
    }
}

/* =============================================================================
 * CLASS: PLAY MAP
 * =============================================================================
 */
class PlayMap {
    constructor(rpgMap) {
        this.cols = rpgMap.getCols();
        this.rows = rpgMap.getRows();
        this.width = this.cols * tileSize;
        this.height = this.rows * tileSize;
        var tiles = new Array(this.cols);
        for (var x = 0; x < this.cols; x++) {
            tiles[x] = new Array(this.rows);
            for (var y = 0; y < this.rows; y++) {
                tiles[x][y] = new PlayTile(rpgMap.getMapTile(x, y));
            }
        }
        this.tiles = tiles;
    }

    getValidLevel(tx, ty) {
        return this.tiles[tx][ty].getALevel();
    }

    isMapBoundaryBreached(baseRect) {
        if ((baseRect.left < 0) || (baseRect.right >= this.width)) {
            return true;
        }
        console.log(baseRect.bottom + ' :: ' + this.height);
        if ((baseRect.top < 0) || (baseRect.bottom >= this.height)) {
            return true;
        }
        return false;
    }

    isSpanValid(level, spanTiles) {
        var sameLevelCount = 0;
        var specialLevels = [];
        // iterate through base tiles and gather information
        spanTiles.forEach(tile => {
            var [increment, specialLevel] = tile.testValidity(level);
            sameLevelCount += increment;
            if (specialLevel) {
                specialLevels.push(specialLevel);
            }
        });
        // test validity of the requested movement
        var spanTileCount = spanTiles.length;
        if (sameLevelCount === spanTileCount) {
            return [true, level];
        }
        if (specialLevels.length === spanTileCount) {
            var minLevel = Math.min(...specialLevels);
            var maxLevel = Math.max(...specialLevels);
            if (maxLevel - minLevel < 1) {
                var result = Number.isInteger(maxLevel) ? maxLevel : minLevel;
                return [true, result];
            }
        }
        return [false, level];
    }

    isMoveValid(level, baseRect) {
        // return this.isSpanValid(level, this._getSpanTiles(baseRect));
        return this.isSpanValid(level, this._getSpanTilesAndCacheStripes(baseRect));
    }

    _isShuffleValid(stripes, keys, level, shuffle) {
        var stripe = stripes.get(keys[shuffle.index1]);
        var [valid, level] = this.isSpanValid(level, stripe);
        if (valid) {
            return [valid, level, shuffle.shuffle1];
        }
        stripe = stripes.get(keys[shuffle.index2]);
        [valid, level] = this.isSpanValid(level, stripe);
        return [valid, level, shuffle.shuffle2];
    }
//     def isShuffleValid(self, stripes, sortedKeys, level, shuffle):
//     index1, shuffle1, index2, shuffle2 = shuffle
//     stripe = stripes[sortedKeys[index1]]
//     valid, level = self.isSpanValid(level, stripe)
//     if valid:
//       return valid, level, shuffle1
//     stripe = stripes[sortedKeys[index2]]
//     valid, level = self.isSpanValid(level, stripe)
//     return valid, level, shuffle2

    _isStripeValid(level, stripes, min, max) {
        if (stripes.size < 2) {
            return [false, level, 0];
        }
        var keys = [...stripes.keys()];
        var minDiff = Math.abs(keys[0] * tileSize - min);
        var maxDiff = Math.abs((keys[1] + 1) * tileSize - max);
        if (minDiff < maxDiff) {
            return this._isShuffleValid(stripes, keys, level, minShuffle);
        }
        return this._isShuffleValid(stripes, keys, level, maxShuffle);
    }
    // def isStripeValid(self, level, stripes, min, max):
    // if len(stripes) < 2:
    //   return False, level, 0
    // sortedKeys = sorted(stripes.keys())
    // minDiff = abs(sortedKeys[0] * TILE_SIZE - min)
    // maxDiff = abs((sortedKeys[-1] + 1) * TILE_SIZE - max)
    // if minDiff < maxDiff:
    //   return self.isShuffleValid(stripes, sortedKeys, level, MIN_SHUFFLE)
    // return self.isShuffleValid(stripes, sortedKeys, level, MAX_SHUFFLE)


    isVerticalValid(level, baseRect) {
        return this._isStripeValid(level, this.verticals, baseRect.left, baseRect.right);
    }

    isHorizontalValid(level, baseRect) {
        return this._isStripeValid(level, this.horizontals, baseRect.top, baseRect.bottom);
    }

    _getSpanTiles(rect) {
        var [tx1, ty1, tx2, ty2] = this._convertRect(rect);
        var rectTiles = [];
        for (var x = tx1; x <= tx2; x++) {
            for (var y = ty1; y <= ty2; y++) {
                rectTiles.push(this.tiles[x][y]);
            }
        }
        return rectTiles;
    }

    _getSpanTilesAndCacheStripes(rect) {
        var [tx1, ty1, tx2, ty2] = this._convertRect(rect);
        var rectTiles = [];
        this.verticals = new Map();
        this.horizontals = new Map();
        for (var x = tx1; x < tx2; x++) {
            var vertical = [];
            for (var y = ty1; y < ty2; y++) {
                if (this.verticals.size === 0) {
                    this.horizontals.set(y, []);
                }
                var tile = this.tiles[x][y];
                rectTiles.push(tile);
                vertical.push(tile);
                this.horizontals.get(y).push(tile);
            }
            this.verticals.set(x, vertical);
        }
        return rectTiles;
    }

    _convertRect(rect) {
        var tx1 = Math.floor(rect.left / tileSize);
        var ty1 = Math.floor(rect.top / tileSize);
        var tx2 = Math.floor(rect.right / tileSize) + 1;
        var ty2 = Math.floor(rect.bottom / tileSize) + 1;
        return [tx1, ty1, tx2, ty2];
    }
}

/* =============================================================================
 * CLASS: MASK INFO
 * =============================================================================
 */
// class MaskInfo {
//     constructor(tileIndex, level, flat, y) {
//         this.level = level;
//         this.flat = flat;
//         this.tileIndex = tileIndex;
//         this.z = (y + 1) * tileSize + level * tileSize - 1;
//     }
// }

export default PlayMap;
