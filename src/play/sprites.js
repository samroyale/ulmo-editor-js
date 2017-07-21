import Q from 'q';
import { tileSize } from '../config';
import { copyCanvas, getDrawingContext, loadImage, Rect } from '../utils';
import { down } from './play-config';

/* =============================================================================
 * CLASS: MOVING FRAMES
 * =============================================================================
 */
export class MovingFrames {
    constructor(imageUrl, directions, frameCount, frameTicks) {
        this._imageUrl = imageUrl;
        this._directions = directions;
        this._frameCount = frameCount;
        this._frameTicks = frameTicks;
        this._frames = null;
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
            this._processFrames(data.img, this._directions);
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
        console.log(this._direction + ' ' + this._frameIndex);
        return this._frames.get(this._direction)[this._frameIndex];
    }

    copyFrame() {
        return copyCanvas(this.currentFrame());
    }

    withFrameIndex(frameIndex) {
        this._frameIndex = frameIndex;
        return this;
    }

    getFrameIndex() {
        return this._frameIndex;
    }
}

/* =============================================================================
 * CLASS: SINGLE FRAME
 * =============================================================================
 */
export class SingleFrame {
    constructor(imageUrl) {
        this._imageUrl = imageUrl;
        this._frame = null;
    }

    load() {
        let deferred = Q.defer();
        loadImage(this._imageUrl, data => {
            if (data.err) {
                deferred.reject({ err: data.err });
                return;
            }
            this._processFrame(data.img);
            deferred.resolve({ currentFrame: this.currentFrame() });
        });
        return deferred.promise;
    }

    _processFrame(img, directions) {
        let spriteWidth = img.width * 2
        let spriteHeight = img.height * 2;
        let frameCanvas = document.createElement('canvas');
        frameCanvas.width = spriteWidth;
        frameCanvas.height = spriteHeight;
        let frameCtx = getDrawingContext(frameCanvas);
        frameCtx.drawImage(img, 0, 0, spriteWidth, spriteHeight);
        this._frame = frameCanvas;
    }

    getDirection() {
        return null;
    }

    advanceFrame(direction) {
        return this.currentFrame();
    }

    currentFrame() {
        return this._frame;
    }

    copyFrame() {
        return copyCanvas(this.currentFrame());
    }
}

/* =============================================================================
 * CLASS: SPRITE GROUP
 * =============================================================================
 */
export class SpriteGroup {
    constructor() {
        this._sprites = [];
    }

    add(sprite) {
        this._sprites.push(sprite);
    }

    remove(sprite) {
        this._sprites.splice(this._sprites.indexOf(sprite), 1);
    }

    update(viewRect, mapSprites) {
        this._sprites.forEach(sprite => sprite.update(viewRect, mapSprites));
    }

    draw(ctx, viewRect) {
        // TODO: z order!
        this._sprites
            .filter(sprite => sprite.isInView(viewRect))
            .forEach(sprite => sprite.draw(ctx, viewRect));
    }
}

/* =============================================================================
 * CLASS: SPRITE
 * =============================================================================
 */
export class Sprite {
    constructor(playMap, level, tx, ty, upright) {
        this._playMap = playMap;
        this._level = level;
        this._tx = tx;
        this._ty = ty;
        this._upright = upright;
        this._canvas = null;
        this._rect = null;
        this._baseRect = null;
        this._zIndex = null;
        this._masked = false;
        this._toRemove = false;
    }

    loadFrames(spriteFrames) {
        this._frames = spriteFrames;
        let p = this._frames.load();
        return p.then(data => {
            this._canvas = data.currentFrame;
            if (this._level && this._tx && this._ty) {
                let marginX = (tileSize - this._canvas.width) / 2;
                let marginY = (tileSize * 2 - this._canvas.height) / 2;
                let px = this._tx * tileSize + marginX;
                let py = (this._ty - 1) * tileSize + marginY;
                this.setPosition(this._level, px, py);
            }
            return data;
        });
    }

    setPosition(level, px, py) {
        this._level = level;
        this._rect = new Rect(px, py, this._canvas.width, this._canvas.height);
        this._baseRect = this._initBaseRect(px, this._rect.width);
        this._zIndex = this._updateZIndex();
    }

    _initBaseRect(baseRectLeft, baseRectWidth) {
        // leave as null by default
    }

    update(viewRect, mapSprites) {
        if (this._toRemove) {
            mapSprites.remove(this);
            return;
        }
        // TODO: apply movement
    }

    draw(ctx, viewRect) {
        this._applyMasksFromMap();
        this._render(ctx, viewRect);
    }

    isInView(viewRect) {
        return viewRect.intersectsWith(this._rect);
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
        var masks = this._playMap.getMasks(this._rect, this._level, this._zIndex, this._upright);
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
    
    _updateZIndex() {
        return Math.floor(this._rect.bottom + this._level * tileSize);
    }

    removeOnNextTick() {
        this._toRemove = true;
    }
}
