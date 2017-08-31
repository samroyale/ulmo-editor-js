import { tileSize, viewWidth, viewHeight } from '../config';
import { drawTile, initTile, Rect } from '../utils';

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

const blackTile = initTile('black');

/* =============================================================================
 * CLASS: MASK INFO
 * =============================================================================
 */
class MaskInfo {
    constructor(tileIndex, level, flat, y) {
        this.level = level;
        this.flat = flat;
        this.tileIndex = tileIndex;
        // this.z1 = (y + 1) * tileSize + level * tileSize;
        this.z1 = tileSize * (y + level + 1);
        this.z2 = flat ? this.z1 + tileSize : this.z1 + 2 * tileSize;
    }
}

/* =============================================================================
 * CLASS: PLAY TILE
 * =============================================================================
 */
class PlayTile {
    constructor(mapTile, x, y) {
        this.x = x;
        this.y = y;

        // tile images
        this.tileImages = [];
        mapTile.getMaskTiles().forEach(maskTile => {
            this.tileImages.push(maskTile.getTile().getCanvas());
        });

        // levels
        this.levels = [];
        this.specialLevels = null;
        this.downLevels = null;
        mapTile.getLevels().forEach(level => {
            if (level.startsWith('S')) {
                this.addSpecialLevel(level);
                return;
            }
            if (level.startsWith('D')) {
                this.addDownLevel(level);
                return;
            }
            this.addLevel(level);
        });

        // masks
        this.masks = null;
        mapTile.getMaskTiles().forEach((maskTile, i) => {
            var maskLevel = maskTile.getMaskLevel();
            if (maskLevel) {
                if (maskLevel.startsWith('V')) {
                    this.addMask(i, Number.parseInt(maskLevel.substr(1), 10), false, y);
                    return;
                }
                this.addMask(i, Number.parseInt(maskLevel, 10), true, y);
            }
        });

        // other stuff
        this.verticals = null;
        this.horizontals = null;
    }

    addLevel(levelStr) {
        this.levels.push(Number.parseInt(levelStr, 10));
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

    addDownLevel(levelStr) {
        if (!this.downLevels) {
            this.downLevels = new Map();
        }
        let levels = levelStr.substr(1).split('-');
        let level = Number.parseInt(levels[0], 10);
        let downLevel = Number.parseInt(levels[1], 10);
        this.downLevels.set(level, downLevel);
    }

    addMask(tileIndex, level, flat, y) {
        if (!this.masks) {
            this.masks = [];
        }
        this.masks.push(new MaskInfo(tileIndex, level, flat, y));
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

    getMasks(spriteZ, spriteLevel, spriteUpright) {
        if (!this.masks) {
            return null;
        }
        var activeMasks = [];
        this.masks.forEach(maskInfo => {
            if (maskInfo.flat && maskInfo.level === spriteLevel) {
                return;
            }
            var tileZ = spriteUpright ? maskInfo.z1 : maskInfo.z2;
            if (tileZ > spriteZ) {
                activeMasks.push(this.tileImages[maskInfo.tileIndex]);
            }
        });
        return activeMasks;
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
        this.mapCanvas = this.drawMap(rpgMap);
        var tiles = new Array(this.cols);
        for (var x = 0; x < this.cols; x++) {
            tiles[x] = new Array(this.rows);
            for (var y = 0; y < this.rows; y++) {
                tiles[x][y] = new PlayTile(rpgMap.getMapTile(x, y), x, y);
            }
        }
        this.tiles = tiles;
    }

    drawMap(rpgMap) {
        var mapCanvas = document.createElement('canvas');
        mapCanvas.width = this.cols * tileSize;
        mapCanvas.height = this.rows * tileSize;
        var ctx = mapCanvas.getContext('2d');
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                var tileCanvas = drawTile(rpgMap.getMapTile(x, y).getMaskTiles(), blackTile);
                ctx.drawImage(tileCanvas, x * tileSize, y * tileSize);
            }
        }
        return mapCanvas;
    }

    determineViewRect(playerRect) {
        let tlx = Math.max(0, playerRect.left + (playerRect.width / 2) - (viewWidth / 2));
        let tly = Math.max(0, playerRect.top + (playerRect.height / 2) - (viewHeight / 2));
        tlx = Math.min(tlx, this.mapCanvas.width - viewWidth);
        tly = Math.min(tly, this.mapCanvas.height - viewHeight);
        // needed to center maps smaller than the view
        // tlx = tlx < 0 ? tlx / 2 : tlx;
        // tly = tly < 0 ? tly / 2 : tly;
        return new Rect(tlx, tly, viewWidth, viewHeight);
    }
    
    drawView(viewCtx, viewRect) {
        viewCtx.drawImage(this.mapCanvas,
            viewRect.left, viewRect.top, viewWidth, viewHeight,
            0, 0, viewWidth, viewHeight);
    }

    isMapBoundaryBreached(rect) {
        if ((rect.left < 0) || (rect.right > this.mapCanvas.width)) {
            return true;
        }
        // console.log(baseRect.bottom + ' :: ' + this.height);
        if ((rect.top < 0) || (rect.bottom > this.mapCanvas.height)) {
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
        return this.isSpanValid(level, this._getSpanTilesAndCacheStripes(baseRect));
    }

    _isShuffleValid(stripes, keys, level, shuffle) {
        var stripe = stripes.get(keys[shuffle.index1]);
        var [valid, newLevel] = this.isSpanValid(level, stripe);
        if (valid) {
            return [valid, newLevel, shuffle.shuffle1];
        }
        stripe = stripes.get(keys[shuffle.index2]);
        [valid, newLevel] = this.isSpanValid(level, stripe);
        return [valid, newLevel, shuffle.shuffle2];
    }

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

    isVerticalValid(level, baseRect) {
        return this._isStripeValid(level, this.verticals, baseRect.left, baseRect.right);
    }

    isHorizontalValid(level, baseRect) {
        return this._isStripeValid(level, this.horizontals, baseRect.top, baseRect.bottom);
    }

    getMasksForUpright(spriteRect, spriteLevel, spriteZ) {
        return this.getMasks(spriteRect, spriteLevel, spriteZ, true);
    }

    getMasks(spriteRect, spriteLevel, spriteZ, spriteUpright) {
        var spriteTiles = this._getSpanTiles(spriteRect);
        var masks = [];
        spriteTiles.forEach(tile => {
            // TODO do we need to check the tile exists?
            var tileMasks = tile.getMasks(spriteZ, spriteLevel, spriteUpright);
            if (tileMasks) {
                masks.push({
                    x: tile.x,
                    y: tile.y,
                    tileMasks: tileMasks
                });
            }
        });
        return masks;
    }
    
    getEvent(level, baseRect) {
        //let downLevels = [];
        let spanTiles = this._getSpanTiles(baseRect);
        let falling = spanTiles.every(tile => {
            let downLevel = tile.getDownLevel(level);
            if (downLevel) {
                return true;
            }
            return false;
        });
        if (falling) {
            return {
                eventType: 'falling',
                downLevel: spanTiles[0].getDownLevel(level)
            }
        }
        return null;
    }

    _getSpanTiles(rect) {
        var [tx1, ty1, tx2, ty2] = this._convertRect(rect);
        var rectTiles = [];
        for (var x = tx1; x < tx2; x++) {
            for (var y = ty1; y < ty2; y++) {
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
        var tx1 = Math.max(0, Math.floor(rect.left / tileSize));
        var ty1 = Math.max(0, Math.floor(rect.top / tileSize));
        var tx2 = Math.min(this.cols - 1, Math.floor((rect.right - 1) / tileSize)) + 1;
        var ty2 = Math.min(this.rows - 1, Math.floor((rect.bottom - 1) / tileSize)) + 1;
        return [tx1, ty1, tx2, ty2];
    }
}

export default PlayMap;
