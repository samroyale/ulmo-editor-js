import { tileSize } from '../config';
import { SpriteFrames, Shadow } from './sprites';
import { Rect } from '../utils';
import {
    upKey, downKey, leftKey, rightKey,
    up, down, left, right,
    directions,
    movement,
    fall_unit,
    spritesImgPath
} from './play-config';

const baseRectHeight = 18, baseRectExtension = 2;

const playerFramesUrl = spritesImgPath + '/ulmo-frames.png';

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
        this._playMap = playMap;
        this._tx = tx;
        this._ty = ty;
        this._level = this._playMap.getValidLevel(tx, ty);
        this._canvas = null;
        this._deferredMovement = null;
        this._masked = false;
        this._keyBits = 0;
        this._frames = new SpriteFrames(playerFramesUrl, directions, 4, 6);
    }

    load() {
        let p = this._frames.load();
        return p.then(data => {
            let frame = data.currentFrame;
            let marginX = (tileSize - frame.width) / 2;
            let marginY = (tileSize * 2 - frame.height) / 2;
            let px = this._tx * tileSize + marginX;
            let py = (this._ty - 1) * tileSize + marginY;
            this._rect = new Rect(px, py, frame.width, frame.height);
            this._baseRect = this._initBaseRect(px, frame.width);
            this._zIndex = this._updateZIndex();
            this._canvas = frame;
            return data;
        });
    }

    _initBaseRect(baseRectLeft, baseRectWidth) {
        let baseRectTop = this._rect.bottom + baseRectExtension - baseRectHeight;
        return new Rect(baseRectLeft, baseRectTop, baseRectWidth, baseRectHeight);
    }

    update(keys) {
        if (this._falling) {
            this._continueFalling();
            return;
        }
        let keyBits = keys.processKeysDown();
        if (keyBits === this._keyBits && this.applyDeferredMovement()) {
            return;
        }
        this._keyBits = keyBits;
        let movement = keys.getMovement(keyBits);
        if (movement) {
            this._move(movement[0], movement[1], movement[2]);
        }
    }

    _move(direction, mx, my) {
        // check requested movement falls within map boundary
        var newRect = this._rect.move(mx, my);
        if (this._playMap.isMapBoundaryBreached(newRect)) {
            return;
        }

        // check requested movement is valid
        var newBaseRect = this._baseRect.move(mx, my);
        var [valid, level] =  this._playMap.isMoveValid(this._level, newBaseRect);
        if (valid) {
            this._applyRectMovement(direction, level, newBaseRect, newRect);
            return;
        }

        // movement invalid but we might be able to slide or shuffle
        if (mx === 0) {
            if (this._shuffleX(direction)) {
                return;
            }
        }
        else if (my === 0) {
            if (this._shuffleY(direction)) {
                return;
            }
        }
        else {
            // diagonal movement
            if (this._slide(direction, mx, my)) {
                return;
            }
        }

        // movement invalid - apply a stationary change of direction if needed
        if (this._frames.getDirection() !== direction) {
            this._moveInternal(direction, this._level, this._rect);
        }
    }

    _shuffleX(direction) {
        // see if we can shuffle horizontally
        var [valid, level, shuffle] = this._playMap.isVerticalValid(this._level, this._baseRect);
        if (valid) {
            this._deferMovement(direction, level, shuffle, 0);
        }
        return valid;
    }

    _shuffleY(direction) {
        // see if we can shuffle vertically
        var [valid, level, shuffle] = this._playMap.isHorizontalValid(this._level, this._baseRect);
        if (valid) {
            this._deferMovement(direction, level, 0, shuffle);
        }
        return valid;
    }

    _slide(direction, mx, my) {
        // see if we can slide horizontally
        var newBaseRect = this._baseRect.move(mx, 0);
        var [valid, level] =  this._playMap.isMoveValid(this._level, newBaseRect);
        if (valid) {
            this._deferMovement(direction, level, mx, 0);
            return valid;
        }
        // see if we can slide vertically
        newBaseRect = this._baseRect.move(0, my);
        [valid, level] =  this._playMap.isMoveValid(this._level, newBaseRect);
        if (valid) {
            this._deferMovement(direction, level, 0, my);
        }
        return valid;
    }

    applyDeferredMovement() {
        if (this._deferredMovement) {
            var [direction, level, mx, my] = this._deferredMovement;
            this._applyMovement(direction, level, mx, my);
            this._deferredMovement = null;
            return true;
        }
        return false;
    }

    _applyMovement(direction, level, mx, my) {
        this._baseRect.moveInPlace(mx, my);
        this._moveInternal(direction, level, this._rect.move(mx, my));
    }

    _applyRectMovement(direction, level, baseRect, rect) {
        this._baseRect = baseRect;
        this._moveInternal(direction, level, rect);
    }

    _deferMovement(direction, level, mx, my) {
        this._deferredMovement = [direction, level, mx, my];
        this._moveInternal(direction, level, this._rect);
    }

    _moveInternal(direction, level, rect) {
        var mapCtx = this._mapCtx();
        // update rects
        // console.log(this._baseRect + " : " + this._rect);
        this._level = level;
        this._rect = rect;
        // draw player in new position
        this._canvas = this._frames.advanceFrame(direction);
        // this._showInternal(mapCtx);
    }

    /**
     * Continues falling + detects if falling is complete.
     */
    _continueFalling() {
        this._applyMovement(this._level, this._direction, 0, fall_unit);
        if (this._falling % tileSize === 0) {
            this._level -= 1;
        }
        this._falling -= fall_unit;
        if (this._falling > 0) {
            return;
        }
        // falling is complete - swap back to moving frames
        // this._clearMasks() ??
        this._frames = this._movingFrames.setState(this._frames);
        this._canvas = this._frames.currentFrame();
        this._applyMasksFromMap(); //??
        this._shadow.removeOnNextTick();
    }

    /**
     * Starts falling by switching frames and adding a shadow to game sprites.
     */
    _startFalling(gameSprites, downLevel) {
        console.log('down: ' + downLevel);
        this.falling = downLevel * tileSize;
        // this._clearMasks() ??
        this._frames = this._fallingFrames.setState(this._frames);
        this._shadow = new Shadow(); // better to have shadow already created?
        this._shadow.setPosition(this, downLevel);
        gameSprites.add(this._shadow);
    }

    drawMapView(viewCtx) {
        return this._playMap.viewMap(this._rect, viewCtx);
    }

    draw(ctx, viewRect) {
        this._applyMasksFromMap();
        this._render(ctx, viewRect);
    }

    _render(ctx, viewRect) {
        ctx.drawImage(this._canvas, this._rect.left - viewRect.left, this._rect.top - viewRect.top);
    }

    _applyMasksFromMap() {
        if (this._masked) {
            // console.log('clear masks');
            this._masked = false;
            this._canvas = this._frames.currentFrame();
        }
        // console.log('get and apply masks');
        this._zIndex = this._updateZIndex();
        var masks = this._playMap.getMasksForUpright(this._rect, this._zIndex, this._level);
        this._applyMasks(masks);
    }

    // masks is a list of lists + x, y values
    _applyMasks(masks) {
        if (masks.length > 0) {
            this._masked = true;
            this._canvas = this._frames.copyFrame();
            var ctx = this._canvas.getContext('2d');
            masks.forEach(mask => {
                var px = mask.x * tileSize - this._rect.left;
                var py = mask.y * tileSize - this._rect.top;
                mask.tileMasks.forEach(tileMask => {
                    ctx.drawImage(tileMask, px, py);
                });
            });
        }
    }

    _mapCtx() {
        return this._playMap.getMapCanvas().getContext('2d');
    }

    _updateZIndex() {
        return Math.floor(this._rect.bottom + this._level * tileSize);
    }
};
