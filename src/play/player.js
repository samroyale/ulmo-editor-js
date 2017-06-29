import Q from 'q';
import { tileSize, spritesImgPath } from '../config';
import { copyCanvas, getDrawingContext, loadImage, Rect } from '../utils';

const upKey = 38, downKey = 40, leftKey = 37, rightKey = 39;

const up = 1, down = 2, left = 4, right = 8;

const directions = [up, down, left, right];

const movement = new Map([
    [up, [up, 0, -2]],
    [down, [down, 0, 2]],
    [left, [left, -2, 0]],
    [right, [right, 2, 0]],
    [up + left, [up, -2, -2]],
    [up + right, [up, 2, -2]],
    [down + left, [down, -2, 2]],
    [down + right, [down, 2, 2]]
]);

const baseRectHeight = 18,
      baseRectExtension = 2;

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
 * CLASS: SPRITE FRAMES
 * =============================================================================
 */
class SpriteFrames {
    constructor(imageUrl, directions, frameCount, frameTicks) {
        this._imageUrl = imageUrl;
        this._frameCount = frameCount;
        this._frameTicks = frameTicks;
        this._direction = down;
        this._frameIndex = 0;
        this._tick = 0;
    }

    load() {
        let deferred = Q.defer();
        loadImage(this._imageUrl, data => {
            if (data.err) {
                deferred.reject({ err: data.err });
                return;
            }
            this._processFrames(data.img, directions);
            deferred.resolve({ currentFrame: this.currentFrame() });
        });
        return deferred.promise;
    }
    
    _processFrames(img, directions) {
        this._frames = new Map();
        let spriteWidth = img.width / this._frameCount;
        let spriteHeight = img.height / directions.length;
        for (let i = 0; i < directions.length; i++) {
            let frames = [];
            for (let j = 0; j < this._frameCount; j++) {
                let frameCanvas = document.createElement('canvas');
                frameCanvas.width = spriteWidth * 2;
                frameCanvas.height = spriteHeight * 2;
                let frameCtx = getDrawingContext(frameCanvas);
                frameCtx.drawImage(img,
                    j * spriteWidth, i * spriteHeight, spriteWidth, spriteHeight,
                    0, 0, spriteWidth * 2, spriteHeight * 2);
                frames.push(frameCanvas);
            }
            this._frames.set(directions[i], frames);
        }
    }

    getDirection() {
        return this._direction;
    }

    advanceFrame(direction) {
        this._direction = direction;
        this._tick = (this._tick + 1) % this._frameTicks;
        if (this._tick === 0) {
            this._frameIndex = (this._frameIndex + 1) % this._frameCount;
        }
        return this.currentFrame();
    }

    currentFrame() {
        return this._frames.get(this._direction)[this._frameIndex];
    }

    copyFrame() {
        return copyCanvas(this.currentFrame());
    }
}

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
        this._background = null;
        this._masked = false;
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
        });
    }

    _initBaseRect(baseRectLeft, baseRectWidth) {
        let baseRectTop = this._rect.bottom + baseRectExtension - baseRectHeight;
        return new Rect(baseRectLeft, baseRectTop, baseRectWidth, baseRectHeight);
    }

    viewMap(viewCtx) {
        this._playMap.viewMap(this._rect, viewCtx);
    }
    
    move(direction, mx, my) {
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
        this._restoreBackground(mapCtx); // must happen before _rect updated
        // update rects
        // console.log(this._baseRect + " : " + this._rect);
        this._level = level;
        this._rect = rect;
        // draw player in new position
        this._canvas = this._frames.advanceFrame(direction);
        this._showInternal(mapCtx);
    }

    show() {
        this._showInternal(this._mapCtx());
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

    _mapCtx() {
        return this._playMap.getMapCanvas().getContext('2d');
    }

    _restoreBackground(ctx) {
        ctx.putImageData(this._background, this._rect.left, this._rect.top);
    }

    _updateZIndex() {
        return Math.floor(this._rect.bottom + this._level * tileSize);
    }
};
