import { tileSize, viewWidth, viewHeight } from '../config';
import { copyCanvas, getDrawingContext, loadImage, Rect } from '../utils';
import {
    up, down, left, right,
    directions,
    movement,
    spritesImgPath,
    defaultBaseRectWidth,
    defaultBaseRectHeight,
    baseRectExtension
} from './PlayConfig';

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
const doorFramesUrl = spritesImgPath + '/door-frames.png';
const bladesFramesUrl = spritesImgPath + '/blades-frames.png';
const checkpointFramesUrl = spritesImgPath + '/check-frames.png';

/* =============================================================================
 * CLASS: MOVING FRAMES
 * -----------------------------------------------------------------------------
 * Sprite frames handler for animated sprites with directional movement
 * =============================================================================
 */
export class MovingFrames {
    constructor(frames, frameCount, frameTicks) {
        this._frames = frames;
        this._frameCount = frameCount;
        this._frameTicks = frameTicks;
        this._direction = down;
        this._frameIndex = 0;
        this._tick = 0;
    }

    static async loadFrames(imageUrl, directions, frameCount, frameTicks) {
        const { img } = await loadImage(imageUrl);
        const frames = this._processFrames(img, directions, frameCount);
        return new MovingFrames(frames, frameCount, frameTicks);
    }

    static _processFrames(img, directions, frameCount) {
        const frames = new Map();
        let spriteWidth = img.width / frameCount;
        let spriteHeight = img.height / directions.length;
        for (let i = 0; i < directions.length; i++) {
            let xFrames = [];
            for (let j = 0; j < frameCount; j++) {
                let frameCanvas = document.createElement('canvas');
                frameCanvas.width = spriteWidth * 2;
                frameCanvas.height = spriteHeight * 2;
                let frameCtx = getDrawingContext(frameCanvas);
                frameCtx.drawImage(img,
                    j * spriteWidth, i * spriteHeight, spriteWidth, spriteHeight,
                    0, 0, spriteWidth * 2, spriteHeight * 2);
                xFrames.push(frameCanvas);
            }
            frames.set(directions[i], xFrames);
        }
        return frames;
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

    getFrameIndex() {
        return this._frameIndex;
    }
}

/* =============================================================================
 * CLASS: STATIC FRAMES
 * -----------------------------------------------------------------------------
 * Sprite frames handler for animated sprites that don't move
 * =============================================================================
 */
export class StaticFrames {
    constructor(frames, frameCount, frameTicks) {
        this._frames = frames;
        this._frameCount = frameCount;
        this._frameTicks = frameTicks;
        this._frameIndex = 0;
        this._tick = 0;
    }

    static async loadFrames(imageUrl, frameCount, frameTicks) {
        const { img } = await loadImage(imageUrl);
        const frames = this._processFrames(img, frameCount);
        return new StaticFrames(frames, frameCount, frameTicks);
    }

    static _processFrames(img, frameCount) {
        let spriteWidth = img.width / frameCount;
        let spriteHeight = img.height;
        let frames = [];
        for (let i = 0; i < frameCount; i++) {
            let frameCanvas = document.createElement('canvas');
            frameCanvas.width = spriteWidth * 2;
            frameCanvas.height = spriteHeight * 2;
            let frameCtx = getDrawingContext(frameCanvas);
            frameCtx.drawImage(img,
                i * spriteWidth, 0, spriteWidth, spriteHeight,
                0, 0, spriteWidth * 2, spriteHeight * 2);
            frames.push(frameCanvas);
        }
        return frames;
    }

    advanceFrame() {
        if (this._frameTicks) {
            this._tick = (this._tick + 1) % this._frameTicks;
            if (this._tick === 0) {
                this._frameIndex = (this._frameIndex + 1) % this._frameCount;
            }
        }
        return this.currentFrame();
    }

    currentFrame() {
        return this._frames[this._frameIndex];
    }

    copyFrame() {
        return copyCanvas(this.currentFrame());
    }

    getFrameIndex() {
        return this._frameIndex;
    }

    withFrameIndex(frameIndex) {
        this._frameIndex = frameIndex;
        return this;
    }

    // can be used to stop/start the frame sequence by passing 0 or >0
    withFrameTicks(frameTicks) {
        this._frameTicks = frameTicks;
        return this;
    }
}

/* =============================================================================
 * CLASS: SINGLE FRAME
 * =============================================================================
 */
export class SingleFrame {
    constructor(frame) {
        this._frame = frame;
    }

    static async loadFrames(imageUrl) {
        const { img } = await loadImage(imageUrl);
        const frame = this._processFrames(img);
        return new SingleFrame(frame);
    }

    static _processFrames(img) {
        let spriteWidth = img.width * 2;
        let spriteHeight = img.height * 2;
        let frameCanvas = document.createElement('canvas');
        frameCanvas.width = spriteWidth;
        frameCanvas.height = spriteHeight;
        let frameCtx = getDrawingContext(frameCanvas);
        frameCtx.drawImage(img, 0, 0, spriteWidth, spriteHeight);
        return frameCanvas;
    };

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
        this._visibleSprites = [];
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
        this._visibleSprites = this._sprites
            .filter(sprite => sprite.isInView());

        this._visibleSprites
            .sort((spriteA, spriteB) => spriteA.getZIndex() - spriteB.getZIndex())
            .forEach(sprite => sprite.draw(ctx, viewRect));
    }

    getVisibleSprites() {
        return this._visibleSprites;
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
        this._inView = false;
        this._toRemove = false;
    }

    withFrames(spriteFrames, marginY) {
        this._frames = spriteFrames;
        this._canvas = spriteFrames.currentFrame();
        if (this._isPositionValid()) {
            let marginX = (tileSize - this._canvas.width) / 2;
            if (!Number.isInteger(marginY)) {
                marginY = this._canvas.height / -2;
            }
            let px = this._tx * tileSize + marginX;
            let py = this._ty * tileSize + marginY;
            this.setPosition(this._level, px, py);
        }
        return this;
    }

    _isPositionValid() {
        return (this._level !== null && this._tx !== null && this._ty !== null);
    }

    setPosition(level, px, py) {
        this._level = level;
        this._rect = new Rect(px, py, this._canvas.width, this._canvas.height);
        this._baseRect = this._initBaseRect(this._rect);
        this._zIndex = this._updateZIndex();
    }

    _initBaseRect(spriteRect) {
        // return null by default
        return null;
    }

    _baseRectTopLeft(baseRectWidth, baseRectHeight) {
        return {
            x: this._rect.left + (this._rect.width - baseRectWidth) / 2,
            y: this._rect.bottom - baseRectHeight
        };
    }

    _defaultBaseRect() {
        let topLeft = this._baseRectTopLeft(defaultBaseRectWidth, defaultBaseRectHeight);
        return new Rect(topLeft.x, topLeft.y, defaultBaseRectWidth, defaultBaseRectWidth);
    }

    update(viewRect, mapSprites, player, applyMovement) {
        if (this._toRemove) {
            mapSprites.remove(this);
            return;
        }
        let movement = this._getMovement(player);
        if (movement) {
            let [direction, mx, my] = movement;
            if (applyMovement) {
                if (this._baseRect) {
                    this._baseRect.moveInPlace(mx, my);
                }
                this._rect.moveInPlace(mx, my);
            }
            this._inView = this._advanceFrame(viewRect, direction);
            if (this._inView) {
                return;
            }
        }
        this._inView = this._advanceFrame(viewRect);
        if (this._inView) {
            return;
        }
        this._processMapExit();
    }

    _advanceFrame(viewRect, direction) {
        let inView = viewRect.intersectsWith(this._rect);
        if (inView) {
            this._canvas = this._frames.advanceFrame(direction);
        }
        return inView;
    }

    _getMovement(player) {
        return null;
    }

    draw(ctx, viewRect) {
        this._applyMasksFromMap();
        this._render(ctx, viewRect);
    }

    isInView() {
        return this._inView;
    }

    assignInView(viewRect) {
        this._inView = viewRect.intersectsWith(this._rect);
    }

    _processMapExit() {
        // do nothing by default
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

    // sprites that kill the player should override this and return true
    processCollision() {
        this.removeOnNextTick();
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

    static async loadSprite(playMap, level, location) {
        const frames = await SingleFrame.loadFrames(rockFramesUrl);
        const sprite = new Rock(playMap, level, location);
        return sprite.withFrames(frames, -8);
    }
}

/* =============================================================================
 * CLASS: FLAMES
 * =============================================================================
 */
export class Flames extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], true);
    }

    static async loadSprite(playMap, level, location) {
        const frames = await StaticFrames.loadFrames(flameFramesUrl, 4, 6);
        const sprite = new Flames(playMap, level, location);
        return sprite.withFrames(frames, 4);
    }
}

/* =============================================================================
 * CLASS: KEY
 * =============================================================================
 */
export class Key extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], true);
    }

    static async loadSprite(playMap, level, location) {
        const frames = await StaticFrames.loadFrames(keyFramesUrl, 6, 6);
        const sprite = new Key(playMap, level, location);
        return sprite.withFrames(frames, 4);
    }

    _initBaseRect() {
        return this._defaultBaseRect();
    }
}

/* =============================================================================
 * CLASS: COIN
 * =============================================================================
 */
export class Coin extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], true);
    }

    static async loadSprite(playMap, level, location) {
        const frames = await StaticFrames.loadFrames(coinFramesUrl, 4, 6);
        const sprite = new Coin(playMap, level, location);
        return sprite.withFrames(frames, 4);
    }

    _initBaseRect() {
        return this._defaultBaseRect();
    }
}

/* =============================================================================
 * CLASS: CHECKPOINT
 * =============================================================================
 */
export class Checkpoint extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], true);
    }

    static async loadSprite(playMap, level, location) {
        const frames = await StaticFrames.loadFrames(checkpointFramesUrl, 4, 12);
        const sprite = new Checkpoint(playMap, level, location);
        return sprite.withFrames(frames, -6);
    }

    _initBaseRect() {
        return this._defaultBaseRect();
    }
}

/* =============================================================================
 * CLASS: DOOR
 * =============================================================================
 */
export class Door extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], true);
    }

    static async loadSprite(playMap, level, location) {
        const frames = await StaticFrames.loadFrames(doorFramesUrl, 10, 0);
        const sprite = new Door(playMap, level, location);
        return sprite.withFrames(frames, -32);
    }

    /* Base rect extends beyond the bottom of the sprite image so player's base
     * rect can intersect with it and allow it to be opened.
     */
    _initBaseRect() {
        let topLeft = this._baseRectTopLeft(8, defaultBaseRectHeight);
        return new Rect(topLeft.x, topLeft.y + baseRectExtension, 8, defaultBaseRectHeight);
    }

    processCollision() {
        // do nothing
    }
}

/* =============================================================================
 * CLASS: BEETLE
 * =============================================================================
 */
export class Beetle extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], false);
        this._positions = location.map(l => [l[0] * tileSize, l[1] * tileSize]);
        this._position = this._positions[0];
        this._positionIndex = 0;
    }

    static async loadSprite(playMap, level, location) {
        const frames = await MovingFrames.loadFrames(beetleFramesUrl, directions, 2, 12);
        const sprite = new Beetle(playMap, level, location);
        return sprite.withFrames(frames, 0);
    }

    _initBaseRect() {
        let topLeft = this._baseRectTopLeft(24, 24);
        return new Rect(topLeft.x, topLeft.y, 24, 24);
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

    processCollision() {
        return true;
    }
}

/* =============================================================================
 * CLASS: WASP
 * =============================================================================
 */
export class Wasp extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], false);
        this._countdown = 12;
        this._zooming = false;
        this._direction = null; // this is also used to detect if the sprite has 'seen' the player
    }

    static async loadSprite(playMap, level, location) {
        const frames = await MovingFrames.loadFrames(waspFramesUrl, directions, 2, 4);
        const sprite = new Wasp(playMap, level, location);
        return sprite.withFrames(frames, 0);
    }

    _initBaseRect() {
        let topLeft = this._baseRectTopLeft(18, 24);
        let rect = new Rect(topLeft.x, topLeft.y, 18, 24);
        this._upRect = new Rect(rect.left, rect.top - viewHeight, rect.width, viewHeight);
        this._downRect = new Rect(rect.left, rect.bottom, rect.width, viewHeight);
        this._leftRect = new Rect(rect.left - viewWidth, rect.top, viewWidth, rect.height);
        this._rightRect = new Rect(rect.right, rect.top, viewWidth, rect.height);
        return rect;
    }

    _getMovement(player) {
        if (this._zooming) {
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

    _processMapExit() {
        if (this._playMap.mapRect.intersectsWith(this._rect)) {
            // still on the map
            return;
        }
        this.removeOnNextTick();
    }

    processCollision() {
        return true;
    }
}

/* =============================================================================
 * CLASS: BLADES
 * =============================================================================
 */
export class Blades extends Sprite {
    constructor(playMap, level, location) {
        super(playMap, level, location[0][0], location[0][1], false);
    }

    static async loadSprite(playMap, level, location) {
        const frames = await StaticFrames.loadFrames(bladesFramesUrl, 10, 0);
        const sprite = new Blades(playMap, level, location);
        sprite.withFrames(frames, -28)._deactivate();
        return sprite;
    }

    _initBaseRect() {
        return new Rect(this._tx * tileSize, this._ty * tileSize, tileSize, tileSize);
    }

    _getMovement() {
        if (this._active) {
            let frameIndex = this._frames.getFrameIndex();
            if (frameIndex === 0) {
                this._deactivate(this._level);
            }
            // if (frameIndex === 2) {
            //     // todo: sound effect
            // }
            return;
        }
        this._countdown -= 1;
        if (this._countdown === 0) {
            this._activate();
        }
    }

    _deactivate(level) {
        this._countdown = 30;
        this._active = false;
        if (level) {
            this._playMap.addLevelToTile(this._tx, this._ty, level);
            this._frames = this._frames.withFrameTicks(0);
        }
    }

    _activate() {
        this._active = true;
        this._playMap.rollbackTile(this._tx, this._ty);
        this._frames = this._frames.withFrameIndex(1).withFrameTicks(6);
    }

    // _getMapTile() {
    //     return this._playMap.getTileAt(this._tx, this._ty);
    // }

    processCollision() {
        return this._frames.getFrameIndex() > 0;
    }
}