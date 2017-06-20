import { tileSize } from '../config';
import { copyCanvas, initRect, Rect } from '../utils';

const upKey = 38, downKey = 40, leftKey = 37, rightKey = 39;

const up = 1, down = 2, left = 4, right = 8;

const movement = new Map([
    [up, [0, -2]],
    [down, [0, 2]],
    [left, [-2, 0]],
    [right, [2, 0]],
    [up + left, [-2, -2]],
    [up + right, [2, -2]],
    [down + left, [-2, 2]],
    [down + right, [2, 2]]
]);

const playerWidth = 24,
      playerHeight = 36,
      marginX = (tileSize - playerWidth) / 2,
      marginY = (tileSize * 2 - playerHeight) / 2;

const baseRectWidth = 24,
      baseRectHeight = 18,
      baseRectExtension = 2;

/* =============================================================================
 * CLASS: KEYS
 * =============================================================================
 */
export class Keys {
    constructor() {
        this._keysDown = Array(128).fill(false);
        this._keysUp = [];
    }

    keyDown(keyCode) {
        // console.log("DOWN: " + keyCode);
        if (keyCode < 128) {
            this._keysDown[keyCode] = true;
        }
    }

    keyUp(keyCode) {
        // console.log("UP: " + keyCode);
        if (keyCode < 128) {
            this._keysUp.push(keyCode);
        }
    }
    // keyUp(keyCode) {
    //     // console.log("UP: " + keyCode);
    //     if (keyCode < 128) {
    //         this._keysDown[keyCode] = false;
    //     }
    // }

    processKeysDown() {
        var keyBits = 0;
        if (this._keysDown[upKey]) {
            keyBits += up;
        }
        if (this._keysDown[downKey]) {
            keyBits += down;
        }
        if (this._keysDown[leftKey]) {
            keyBits += left;
        }
        if (this._keysDown[rightKey]) {
            keyBits += right;
        }
        this._flush();
        return keyBits;
    }

    getMovement(keyBits) {
        return movement.get(keyBits);
    }

    _flush() {
        if (this._keysUp.length === 0) {
            return;
        }
        this._keysUp.forEach(k => this._keysDown[k] = false);
        this._keysUp = [];
    }
    // _flush() {
    //     // do nothing
    // }
};

/* =============================================================================
 * CLASS: PLAYER
 * =============================================================================
 */
export class Player {
    constructor(playMap, tx, ty) {
        //this._playerCanvas = null,
        this._playMap = playMap;
        this._initPlayer(tx, ty);
        this._deferredMovement = null;
        this._unspoiledCanvas = null;
        this._background = null;
        this._masked = false;
    }

    _initPlayer(tx, ty) {
        var px = tx * tileSize + marginX;
        var py = ty * tileSize + marginY;
        this._rect = new Rect(px, py, playerWidth, playerHeight);
        py = this._rect.bottom + baseRectExtension - baseRectHeight;
        this._baseRect = new Rect(px, py, baseRectWidth, baseRectHeight);
        this._level = this._playMap.getValidLevel(tx, ty);
        this._zIndex = this._updateZIndex();
        this._canvas = initRect("#FF0000", playerWidth, playerHeight);
    }

    viewMap(viewCtx) {
        this._playMap.viewMap(this._rect, viewCtx);
    }
    
    move(mx, my) {
        // check requested movement falls within map boundary
        var newRect = this._rect.move(mx, my);
        if (this._playMap.isMapBoundaryBreached(newRect)) {
            return;
        }

        // check requested movement is valid
        var newBaseRect = this._baseRect.move(mx, my);
        var [valid, level] =  this._playMap.isMoveValid(this._level, newBaseRect);
        if (valid) {
            this._applyRectMovement(level, newBaseRect, newRect);
            return;
        }

        // movement invalid but we might be able to slide or shuffle
        if (mx === 0) {
            if (this._shuffleX()) {
                return;
            }
        }
        else if (my === 0) {
            if (this._shuffleY()) {
                return;
            }
        }
        else {
            // diagonal movement
            if (this._slide(mx, my)) {
                return;
            }
        }

        // movement invalid - apply a stationary change of direction if needed
    }

    _shuffleX() {
        // see if we can shuffle horizontally
        var [valid, level, shuffle] = this._playMap.isVerticalValid(this._level, this._baseRect);
        if (valid) {
            this._deferMovement(level, shuffle, 0);
        }
        return valid;
    }

    _shuffleY() {
        // see if we can shuffle vertically
        var [valid, level, shuffle] = this._playMap.isHorizontalValid(this._level, this._baseRect);
        if (valid) {
            this._deferMovement(level, 0, shuffle);
        }
        return valid;
    }

    _slide(mx, my) {
        // see if we can slide horizontally
        var newBaseRect = this._baseRect.move(mx, 0);
        var [valid, level] =  this._playMap.isMoveValid(this._level, newBaseRect);
        if (valid) {
            this._deferMovement(level, mx, 0);
            return valid;
        }
        // see if we can slide vertically
        newBaseRect = this._baseRect.move(0, my);
        [valid, level] =  this._playMap.isMoveValid(this._level, newBaseRect);
        if (valid) {
            this._deferMovement(level, 0, my);
        }
        return valid;
    }

    applyDeferredMovement() {
        if (this._deferredMovement) {
            var [level, mx, my] = this._deferredMovement;
            this._applyMovement(level, mx, my);
            return true;
        }
        return false;
    }

    _applyMovement(newLevel, mx, my) {
        this._baseRect.moveInPlace(mx, my);
        this._moveInternal(newLevel, this._rect.move(mx, my));
    }

    _applyRectMovement(newLevel, newBaseRect, newRect) {
        this._baseRect = newBaseRect;
        this._moveInternal(newLevel, newRect);
    }

    _moveInternal(level, rect) {
        var mapCtx = this._playMap.getMapCanvas().getContext('2d');
        this._restoreBackground(mapCtx); // must happen before _rect updated
        // update rects
        console.log(this._baseRect + " : " + this._rect);
        this._level = level;
        this._rect = rect;
        // draw player in new position
        this._showInternal(mapCtx);
        // reset deferred movement
        this._deferredMovement = null;
    }

    _deferMovement(newLevel, mx, my) {
        this._deferredMovement = [newLevel, mx, my];
    }

    show() {
        var mapCtx = this._playMap.getMapCanvas().getContext('2d');
        this._showInternal(mapCtx);
    }

    _showInternal(ctx) {
        this._applyMasksFromMap();
        this._background = ctx.getImageData(this._rect.left, this._rect.top,
            this._rect.width, this._rect.height);
        ctx.drawImage(this._canvas, this._rect.left, this._rect.top);
    }

    _applyMasksFromMap() {
        if (this._masked) {
            // console.log('clear masks');
            this._masked = false;
            this._canvas = this._unspoiledCanvas;
        }
        // console.log('get and apply masks');
        this._zIndex = this._updateZIndex();
        var masks = this._playMap.getMasksForUpright(this._rect, this._zIndex, this._level);
        // var masks = playMap.getMasks(this._rect, this._zIndex, this._level, false);
        this._applyMasks(masks);
    }

    // masks is a list of lists + x, y values
    _applyMasks(masks) {
        if (masks.length > 0) {
            this._masked = true;
            this._unspoiledCanvas = copyCanvas(this._canvas);
            masks.forEach(mask => {
                var px = mask.x * tileSize - this._rect.left;
                var py = mask.y * tileSize - this._rect.top;
                var ctx = this._canvas.getContext('2d');
                mask.tileMasks.forEach(tileMask => {
                    ctx.drawImage(tileMask, px, py);
                });
            });
        }
    }

    _restoreBackground(ctx) {
        ctx.putImageData(this._background, this._rect.left, this._rect.top);
    }

    _updateZIndex() {
        return Math.floor(this._rect.bottom + this._level * tileSize);
    }
};
