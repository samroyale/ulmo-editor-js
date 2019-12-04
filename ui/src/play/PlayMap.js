import { tileSize, viewWidth, viewHeight } from '../config';
import { drawTile, initTile, parseLevel, Rect } from '../utils';

// const minShuffle = {
//     index1: 0,
//     shuffle1: -2,
//     index2: 1,
//     shuffle2: 2
// };

// const maxShuffle = {
//     index1: 1,
//     shuffle1: 2,
//     index2: 0,
//     shuffle2: -2
// };

const blackTile = initTile('black');

function asTileData(mapTile, x, y) {
    const levels = [];
    const downLevels = [];
    const specialLevels = [];
    mapTile.getLevels()
        .map(level => parseLevel(level))
        .forEach(parsed => {
            if (parsed.type === 'special') {
                specialLevels.push(parsed.level);
            }
            else if (parsed.type === 'down') {
                downLevels.push([parsed.level, parsed.drop]);
            }
            else {
                levels.push(parsed.level);
            }
        });

    const masks = [];
    mapTile.getMaskTiles().forEach((maskTile, i) => {
        var maskLevel = maskTile.getMaskLevel();
        if (maskLevel) {
            if (maskLevel.startsWith('V')) {
                const level = Number.parseInt(maskLevel.substr(1), 10);
                masks.push([i, level * 2, false, y]);
                return;
            }
            const level = Number.parseInt(maskLevel, 10);
            masks.push([i, level * 2, true, y]);
        }
    });

    return {
        levels: levels,
        down_levels: downLevels,
        special_levels: specialLevels,
        masks: masks
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
//         // this.z1 = (y + 1) * tileSize + level * tileSize;
//         this.z1 = tileSize * (y + level + 1);
//         this.z2 = flat ? this.z1 + tileSize : this.z1 + 2 * tileSize;
//     }
// }

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
        // this.levels = [];
        // this.specialLevels = null;
        // this.downLevels = null;
        // mapTile.getLevels()
        //     .map(level => parseLevel(level))
        //     .forEach(parsed => {
        //         if (parsed.type === 'special') {
        //             this.addSpecialLevel(parsed);
        //             return;
        //         }
        //         if (parsed.type === 'down') {
        //             this.addDownLevel(parsed);
        //             return;
        //         }
        //         this.levels.push(parsed.level);
        //     });

        // // masks
        // this.masks = null;
        // mapTile.getMaskTiles().forEach((maskTile, i) => {
        //     var maskLevel = maskTile.getMaskLevel();
        //     if (maskLevel) {
        //         if (maskLevel.startsWith('V')) {
        //             this.addMask(i, Number.parseInt(maskLevel.substr(1), 10), false, y);
        //             return;
        //         }
        //         this.addMask(i, Number.parseInt(maskLevel, 10), true, y);
        //     }
        // });

        // other stuff
        // this.oldLevels = null;
    }

    getTileImages(indices) {
        return indices.map(index => this.tileImages[index]);
    }

    // addSpecialLevel(parsed) {
    //     if (!this.specialLevels) {
    //         this.specialLevels = new Map();
    //     }
    //     if (parsed.high && parsed.low) {
    //         this.specialLevels.set(parsed.high, parsed.level);
    //         this.specialLevels.set(parsed.low, parsed.level);
    //         return;
    //     }
    //     this.specialLevels.set(parsed.level, parsed.level);
    // }

    // addDownLevel(parsed) {
    //     if (!this.downLevels) {
    //         this.downLevels = new Map();
    //     }
    //     this.downLevels.set(parsed.level, parsed.drop);
    // }

    // addMask(tileIndex, level, flat, y) {
    //     if (!this.masks) {
    //         this.masks = [];
    //     }
    //     this.masks.push(new MaskInfo(tileIndex, level, flat, y));
    // }

    // testValidity(level) {
    //     if (this.levels.includes(level)) {
    //         return [1, null];
    //     }
    //     var downLevel = this.getDownLevel(level);
    //     if (downLevel) {
    //         return [1, null];
    //     }
    //     var specialLevel = this.getSpecialLevel(level);
    //     if (specialLevel) {
    //         if (specialLevel === level) {
    //             return [1, specialLevel];
    //         }
    //         return [0, specialLevel];
    //     }
    //     return [0, null];
    // }

    // getSpecialLevel(level) {
    //     if (!this.specialLevels) {
    //         return null;
    //     }
    //     var specialLevel = this.specialLevels.get(level);
    //     if (specialLevel) {
    //         return specialLevel;
    //     }
    //     specialLevel = this.specialLevels.get(Math.floor(level));
    //     if (specialLevel) {
    //         return specialLevel;
    //     }
    //     specialLevel = this.specialLevels.get(Math.ceil(level));
    //     if (specialLevel) {
    //         return specialLevel;
    //     }
    //     return null;
    // }

    // getDownLevel(level) {
    //     if (!this.downLevels) {
    //         return null;
    //     }
    //     var downLevel = this.downLevels.get(level);
    //     if (downLevel) {
    //         return downLevel;
    //     }
    // }

    // getMasks(spriteZ, spriteLevel, spriteUpright) {
    //     if (!this.masks) {
    //         return null;
    //     }
    //     var activeMasks = [];
    //     this.masks.forEach(maskInfo => {
    //         if (maskInfo.flat && maskInfo.level === spriteLevel) {
    //             return;
    //         }
    //         var tileZ = spriteUpright ? maskInfo.z1 : maskInfo.z2;
    //         if (tileZ > spriteZ) {
    //             activeMasks.push(this.tileImages[maskInfo.tileIndex]);
    //         }
    //     });
    //     return activeMasks;
    // }

    // addNewLevel(level) {
    //     this.oldLevels = this.levels.slice();
    //     this.levels.push(level);
    // }
    //
    // rollback() {
    //     if (this.oldLevels) {
    //         this.levels = this.oldLevels;
    //     }
    // }
}

/* =============================================================================
 * CLASS: PLAY MAP
 * =============================================================================
 */
class PlayMap {
    constructor(rpgMap, wasm) {
        this.wasm = wasm;
        this.cols = rpgMap.getCols();
        this.rows = rpgMap.getRows();
        this.mapRect = new Rect(0, 0, this.cols * tileSize, this.rows * tileSize);
        this.mapCanvas = this.drawMap(rpgMap);

        const tiles = new Array(this.cols);
        for (let x = 0; x < this.cols; x++) {
            tiles[x] = new Array(this.rows);
            for (let y = 0; y < this.rows; y++) {
                tiles[x][y] = new PlayTile(rpgMap.getMapTile(x, y), x, y);
            }
        }
        this.tiles = tiles;

        const tileData = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                tileData.push(asTileData(rpgMap.getMapTile(x, y), x, y));
            }
        }
        // debugger
        const { PlayMap: WasmPlayMap } = this.wasm;
        this.wasmPlayMap = WasmPlayMap.from_js_data({
            rows: this.rows,
            cols: this.cols,
            tile_data: tileData,
            tile_size: tileSize
        });
    }

    applyMove(mx, my, level, baseRect) {
        const result = this.wasmPlayMap.apply_move(mx, my, Math.round(level * 2), baseRect.toWasmRect(this.wasm));
        return [
            result.is_valid(),
            result.get_deferral(),
            result.get_level() / 2,
            result.get_mx(),
            result.get_my()
        ];
    }

    drawMap(rpgMap) {
        var mapCanvas = document.createElement('canvas');
        mapCanvas.width = this.mapRect.width;
        mapCanvas.height = this.mapRect.height;
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
        return (rect.top < 0) || (rect.bottom > this.mapCanvas.height);
    }

    // getMasksForUpright(spriteRect, spriteLevel, spriteZ) {
    //     return this.getMasks(spriteRect, spriteLevel, spriteZ, true);
    // }

    getMasks(spriteRect, spriteLevel, spriteZ, spriteUpright) {
        const masks = this.wasmPlayMap.get_js_sprite_masks(
            spriteRect.toWasmRect(this.wasm),
            spriteZ,
            spriteLevel * 2,
            spriteUpright
        );
        debugger;
        return masks.map(mask => {
            const tx = mask.tx;
            const ty = mask.ty;
            return {
                x: tx,
                y: ty,
                tileMasks: this.tiles[tx][ty].getTileImages(mask.tile_indices)
            }
        });
    }

    // getMasks(spriteRect, spriteLevel, spriteZ, spriteUpright) {
    //     const spriteTiles = this._getSpanTiles(spriteRect);
    //     const masks = [];
    //     spriteTiles.forEach(tile => {
    //         // TODO do we need to check the tile exists?
    //         const tileMasks = tile.getMasks(spriteZ, spriteLevel, spriteUpright);
    //         if (tileMasks) {
    //             masks.push({
    //                 x: tile.x,
    //                 y: tile.y,
    //                 tileMasks: tileMasks
    //             });
    //         }
    //     });
    //     return masks;
    // }

    getEvent(level, baseRect) {
        const event = this.wasmPlayMap.get_event(Math.round(level * 2), baseRect.toWasmRect(this.wasm));
        const eventType = event.get_event_type();
        if (eventType === 1) {
            return {
                eventType: 'falling',
                downLevel: event.get_value() / 2
            };
        }
        return null;
    }

    // _getSpanTiles(rect) {
    //     var [tx1, ty1, tx2, ty2] = this._convertRect(rect);
    //     var rectTiles = [];
    //     for (var x = tx1; x < tx2; x++) {
    //         for (var y = ty1; y < ty2; y++) {
    //             rectTiles.push(this.tiles[x][y]);
    //         }
    //     }
    //     return rectTiles;
    // }

    // _getSpanTilesAndCacheStripes(rect) {
    //     var [tx1, ty1, tx2, ty2] = this._convertRect(rect);
    //     var rectTiles = [];
    //     this.verticals = new Map();
    //     this.horizontals = new Map();
    //     for (var x = tx1; x < tx2; x++) {
    //         var vertical = [];
    //         for (var y = ty1; y < ty2; y++) {
    //             if (this.verticals.size === 0) {
    //                 this.horizontals.set(y, []);
    //             }
    //             var tile = this.tiles[x][y];
    //             rectTiles.push(tile);
    //             vertical.push(tile);
    //             this.horizontals.get(y).push(tile);
    //         }
    //         this.verticals.set(x, vertical);
    //     }
    //     return rectTiles;
    // }

    // _convertRect(rect) {
    //     var tx1 = Math.max(0, Math.floor(rect.left / tileSize));
    //     var ty1 = Math.max(0, Math.floor(rect.top / tileSize));
    //     var tx2 = Math.min(this.cols - 1, Math.floor((rect.right - 1) / tileSize)) + 1;
    //     var ty2 = Math.min(this.rows - 1, Math.floor((rect.bottom - 1) / tileSize)) + 1;
    //     return [tx1, ty1, tx2, ty2];
    // }

    // getTileAt(tx, ty) {
    //     return this.tiles[tx][ty];
    // }
    addLevelToTile(tx, ty, level) {
        this.wasmPlayMap.add_level_to_tile(tx, ty, level * 2);
    }

    rollbackTile(tx, ty) {
        this.wasmPlayMap.rollback_tile(tx, ty);
    }
}

export default PlayMap;
