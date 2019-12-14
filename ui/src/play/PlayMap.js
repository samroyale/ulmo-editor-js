import { tileSize, viewWidth, viewHeight } from '../config';
import { drawTile, initTile, parseLevel, Rect } from '../utils';

const blackTile = initTile('black');

function parseLevelx2(levelStr) {
    let { type, level, drop } = parseLevel(levelStr);
    if (type === 'special') {
        if (Number.isInteger(level)) {
            return {
                type: type,
                level: level * 2
            }
        }
        return {
            type: type,
            level: Math.floor(level) * 2 + 1
        }
    }
    else if (type === 'down') {
        return {
            type: type,
            level: level * 2,
            drop: drop * 2
        };
    }
    else {
        return {
            type: type,
            level: level * 2
        };
    }
}

function asTileData(mapTile, x, y) {
    const levels = [];
    const downLevels = [];
    const specialLevels = [];
    mapTile.getLevels()
        .map(level => parseLevelx2(level))
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
        downLevels: downLevels,
        specialLevels: specialLevels,
        masks: masks
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
    }

    getTileImages(indices) {
        return indices.map(index => this.tileImages[index]);
    }
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
        const { WasmPlayMap } = this.wasm;
        this.wasmPlayMap = new WasmPlayMap({
            rows: this.rows,
            cols: this.cols,
            tileData: tileData,
            tileSize: tileSize
        });
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
        return (rect.top < 0) || (rect.bottom > this.mapCanvas.height);
    }

    // getMasksForUpright(spriteRect, spriteLevel, spriteZ) {
    //     return this.getMasks(spriteRect, spriteLevel, spriteZ, true);
    // }

    applyMove(mxIn, myIn, levelIn, baseRect) {
        const { valid, deferral, level, mx, my } = this.wasmPlayMap.applyMove(mxIn, myIn, Math.round(levelIn * 2), baseRect.toWasmRect(this.wasm));
        return [valid, deferral, level / 2, mx, my];
    }

    getMasks(spriteRect, spriteLevel, spriteZ, spriteUpright) {
        const masks = this.wasmPlayMap.getSpriteMasks(
            spriteRect.toWasmRect(this.wasm),
            spriteZ,
            spriteLevel * 2,
            spriteUpright
        );
        return masks.map(({tx, ty, tileIndices}) => {
            return {
                x: tx,
                y: ty,
                tileMasks: this.tiles[tx][ty].getTileImages(tileIndices)
            }
        });
    }

    getEvent(level, baseRect) {
        const event = this.wasmPlayMap.getEvent(Math.round(level * 2), baseRect.toWasmRect(this.wasm));
        if (event) {
            const { eventType, value } = event;
            if (eventType === 1) {
                return {
                    eventType: 'falling',
                    downLevel: value / 2
                };
            }
        }
        return null;
    }

    addLevelToTile(tx, ty, level) {
        this.wasmPlayMap.addLevelToTile(tx, ty, level * 2);
    }

    rollbackTile(tx, ty) {
        this.wasmPlayMap.rollbackTile(tx, ty);
    }
}

export default PlayMap;
