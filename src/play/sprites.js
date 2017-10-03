import Q from 'q';
import { tileSize, viewWidth, viewHeight } from '../config';
import { copyCanvas, getDrawingContext, loadImage, Rect } from '../utils';
import {
    up, down, left, right,
    directions,
    movement,
    spritesImgPath
} from './play-config';

const zoomMovement = new Map([
    [up, [up, 0, -4]],
    [down, [down, 0, 4]],
    [left, [left, -4, 0]],
    [right, [right, 4, 0]]
]);

const staticMovement = new Map([
    [up, [up, 0, 0]],
    [down, [down, 0, 0]],
    [left, [left, 0, 0]],
    [right, [right, 0, 0]]
]);


const rockFramesUrl = spritesImgPath + '/rock.png';
const keyFramesUrl = spritesImgPath + '/key-frames.png';
const flameFramesUrl = spritesImgPath + '/flame-frames.png';
const coinFramesUrl = spritesImgPath + '/coin-frames.png';
const beetleFramesUrl = spritesImgPath + '/beetle-frames.png';
const waspFramesUrl = spritesImgPath + '/wasp-frames.png';

/* =============================================================================
 * CLASS: MOVING FRAMES
 * -----------------------------------------------------------------------------
 * Sprite frames handler that is aware of directional movement
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
        if (direction) {
            this._direction = direction;
        }
        this._tick = (this._tick + 1) % this._frameTicks;
        if (this._tick === 0) {
            this._frameIndex = (this._frameIndex + 1) % this._frameCount;
        }
        return this.currentFrame();
    }

    currentFrame() {
        // console.log(this._direction + ' ' + this._frameIndex);
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
 * CLASS: STATIC FRAMES
 * -----------------------------------------------------------------------------
 * Frames handler for static animated sprites
 * =============================================================================
 */
export class StaticFrames {
    constructor(imageUrl, frameCount, frameTicks) {
        this._imageUrl = imageUrl;
        this._frameCount = frameCount;
        this._frameTicks = frameTicks;
        this._frames = null;
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
        let spriteWidth = img.width / this._frameCount;
        let spriteHeight = img.height;
        let frames = [];
        for (let i = 0; i < this._frameCount; i++) {
            let frameCanvas = document.createElement('canvas');
            frameCanvas.width = spriteWidth * 2;
            frameCanvas.height = spriteHeight * 2;
            let frameCtx = getDrawingContext(frameCanvas);
            frameCtx.drawImage(img,
                i * spriteWidth, 0, spriteWidth, spriteHeight,
                0, 0, spriteWidth * 2, spriteHeight * 2);
            frames.push(frameCanvas);
        }
        this._frames = frames;
    }

    advanceFrame() {
        this._tick = (this._tick + 1) % this._frameTicks;
        if (this._tick === 0) {
            this._frameIndex = (this._frameIndex + 1) % this._frameCount;
        }
        return this.currentFrame();
    }

    currentFrame() {
        // console.log(this._direction + ' ' + this._frameIndex);
        return this._frames[this._frameIndex];
    }

    copyFrame() {
        return copyCanvas(this.currentFrame());
    }

    withFrameIndex(frameIndex) {
        this._frameIndex = frameIndex;
        return this;
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

    advanceFrame() {
        return this._frame;
    }

    currentFrame() {
        return this._frame;
    }

    copyFrame() {
        return copyCanvas(this._frame);
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

    addAll(sprites) {
        sprites.forEach(sprite => this._sprites.push(sprite));
    }

    remove(sprite) {
        this._sprites.splice(this._sprites.indexOf(sprite), 1);
    }

    update(...args) {
        this._sprites.forEach(sprite => sprite.update(...args));
    }

    draw(ctx, viewRect) {
        this._sprites
            .filter(sprite => sprite.isInView(viewRect))
            .sort((spriteA, spriteB) => spriteA.getZIndex() - spriteB.getZIndex())
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
        this._inView = false;
    }

    loadFrames(spriteFrames, marginY) {
        this._frames = spriteFrames;
        let p = this._frames.load();
        return p.then(data => {
            this._canvas = data.currentFrame;
            if (this._level && this._tx && this._ty) {
                let marginX = (tileSize - this._canvas.width) / 2;
                if (!Number.isInteger(marginY)) {
                    marginY = this._canvas.height / -2;
                }
                let px = this._tx * tileSize + marginX;
                let py = this._ty * tileSize + marginY;
                this.setPosition(this._level, px, py);
            }
            return data;
        });
    }

    setPosition(level, px, py) {
        this._level = level;
        this._rect = new Rect(px, py, this._canvas.width, this._canvas.height);
        this._baseRect = this._initBaseRect(this._rect);
        this._zIndex = this._updateZIndex();
    }

    _initBaseRect(spriteRect) {
        // leave as null by default
    }

    update(viewRect, mapSprites, player) {
        if (this._toRemove) {
            mapSprites.remove(this);
            return;
        }
        let movement = this._getMovement(player);
        // TODO: could advanceFrame be deferred to the draw stage?
        if (movement) {
            let [direction, mx, my] = movement;
            // if (this._baseRect) {
            //     this._baseRect.moveInPlace(mx, my);
            // }
            this._rect.moveInPlace(mx, my);
            this._inView = viewRect.intersectsWith(this._rect);
            this._canvas = this._frames.advanceFrame(direction);
            return;
        }
        this._inView = viewRect.intersectsWith(this._rect);
        this._canvas = this._frames.advanceFrame();
    }
    
    _getMovement(player) {
        return null;
    }

    draw(ctx, viewRect) {
        this._applyMasksFromMap();
        this._render(ctx, viewRect);
    }

    isInView(viewRect) {
        return this._inView;
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

    getZIndex() {
        return this._zIndex;
    }

    getLevel() {
        return this._level;
    }

    getBaseRect() {
        return this._baseRect;
    }

    removeOnNextTick() {
        this._toRemove = true;
    }
}

/* =============================================================================
 * CLASS: ROCK
 * =============================================================================
 */
export class Rock extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], true);
        this._frames = new SingleFrame(rockFramesUrl);
    }

    load() {
        return this.loadFrames(this._frames, -8);
    }
}

/* =============================================================================
 * CLASS: KEY
 * =============================================================================
 */
export class Key extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], true);
        this._frames = new StaticFrames(keyFramesUrl, 6, 6);
    }

    load() {
        return this.loadFrames(this._frames, 4);
    }
}

/* =============================================================================
 * CLASS: FLAMES
 * =============================================================================
 */
export class Flames extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], true);
        this._frames = new StaticFrames(flameFramesUrl, 4, 6);
    }

    load() {
        return this.loadFrames(this._frames, 4);
    }
}

/* =============================================================================
 * CLASS: COIN
 * =============================================================================
 */
export class Coin extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], true);
        this._frames = new StaticFrames(coinFramesUrl, 4, 6);
    }

    load() {
        return this.loadFrames(this._frames, 4);
    }
}

/* =============================================================================
 * CLASS: BEETLE
 * =============================================================================
 */
export class Beetle extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], false);
        this._frames = new MovingFrames(beetleFramesUrl, directions, 2, 12);
        this._positions = location.map(l => [l[0] * tileSize, l[1] * tileSize]);
        this._position = this._positions[0];
        this._positionIndex = 0;
    }

    _initBaseRect(spriteRect) {
        // TODO: refine this
        return new Rect(spriteRect.left, spriteRect.top, spriteRect.width, spriteRect.height);
    }

    _getMovement() {
        let currentPosition = this._rect.getTopLeft();
        let x = this._position[0] - currentPosition.x;
        let y = this._position[1] - currentPosition.y;
        if (x === 0 && y === 0) {
            this._positionIndex = (this._positionIndex + 1) % this._positions.length;
            this._position = this._positions[this._positionIndex];
            x = this._position[0] - currentPosition.x;
            y = this._position[1] - currentPosition.y;
        }
        if (x < 0) {
            return movement.get(left);
        }
        if (x > 0) {
            return movement.get(right);
        }
        if (y < 0) {
            return movement.get(up);
        }
        if (y > 0) {
            return movement.get(down);
        }
        // otherwise there is nowhere to move to
        return null;
    }

    load() {
        return this.loadFrames(this._frames, 0);
    }
}

/* =============================================================================
 * CLASS: WASP
 * =============================================================================
 */
export class Wasp extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], false);
        this._frames = new MovingFrames(waspFramesUrl, directions, 2, 4);
        this._countdown = 12;
        this._zooming = false;
        this._direction = null; // this is also used to detect if the sprite has 'seen' the player
    }

    _initBaseRect(spriteRect) {
        // TODO: refine this
        let rect = new Rect(spriteRect.left, spriteRect.top, spriteRect.width, spriteRect.height);
        this._upRect = new Rect(rect.left, rect.top - viewHeight, rect.width, viewHeight);
        this._downRect = new Rect(rect.left, rect.bottom, rect.width, viewHeight);
        this._leftRect = new Rect(rect.left - viewWidth, rect.top, viewWidth, rect.height);
        this._rightRect = new Rect(rect.right, rect.top, viewWidth, rect.height);
        return rect;
    }

    _getMovement(player) {
        if (this._zooming) {
            console.log("WASP ZOOMING");
            return zoomMovement.get(this._direction);
        }
        if (this._inView && !this._direction && this._level === player.getLevel()) {
            if (this._leftRect.intersectsWith(player.getBaseRect())) {
                this._direction = left;
            }
            if (this._rightRect.intersectsWith(player.getBaseRect())) {
                this._direction = right;
            }
            if (this._upRect.intersectsWith(player.getBaseRect())) {
                this._direction = up;
            }
            if (this._downRect.intersectsWith(player.getBaseRect())) {
                this._direction = down;
            }
            return staticMovement.get(this._direction);
        }
        if (this._direction) {
            // the sprite has 'seen' the player - countdown begins
            this._countdown -= 1;
            if (this._countdown === 0) {
                this._zooming = true;
            }
        }
        return null;
    }

    load() {
        return this.loadFrames(this._frames, 0);
    }
}