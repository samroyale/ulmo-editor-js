import Q from 'q';
import { tileSize } from '../config';
import { Sprite, MovingFrames, StaticFrames, SingleFrame } from './sprites';
import { Rect } from '../utils';
import {
    upKey, downKey, leftKey, rightKey,
    up, down, left, right,
    directions,
    movement,
    fallUnit,
    spritesImgPath,
    defaultBaseRectHeight,
    baseRectExtension
} from './play-config';

const playerFramesUrl = spritesImgPath + '/ulmo-frames.png';
const playerFallingFramesUrl = spritesImgPath + '/ulmo-falling.png';
const shadowFramesUrl = spritesImgPath + '/shadow.png';

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
 * CLASS: SHADOW
 * =============================================================================
 */
export class Shadow extends Sprite {
    constructor(playMap, frames) {
        super(playMap, null, null, null, false);
        // frames is pre-loaded by player
        this._frames = frames;
        this._canvas = frames.currentFrame();
    }

    setPosition(playerRect, playerLevel, downLevel) {
        let px = playerRect.left;
        let py = playerRect.top + downLevel * tileSize + playerRect.height - this._canvas.height;
        super.setPosition(playerLevel - downLevel, px, py);
    }
}

/* =============================================================================
 * CLASS: PLAYER
 * =============================================================================
 */
export class Player extends Sprite {
    constructor(playMap, level, tx, ty) {
        super(playMap, level, tx, ty, true);
        this._movingFrames = new MovingFrames(playerFramesUrl, directions, 4, 6);
        this._fallingFrames = new StaticFrames(playerFallingFramesUrl, 4, 0);
        this._shadowFrames = new SingleFrame(shadowFramesUrl);
        this._deferredMovement = null;
        this._keyBits = 0;
        this._deferDiagonal = true;
    }

    load() {
        return Q.all([
            this.loadFrames(this._movingFrames),
            this._fallingFrames.load(),
            this._shadowFrames.load()
        ]);
    }

    _initBaseRect(spriteRect) {
        this._inView = true;
        let baseRectTop = spriteRect.bottom + baseRectExtension - defaultBaseRectHeight;
        return new Rect(spriteRect.left, baseRectTop, spriteRect.width, defaultBaseRectHeight);
    }

    handleInput(keyBits) {
        this._handleInputInternal(keyBits);
        return this._playMap.determineViewRect(this._rect);
    }

    _handleInputInternal(keyBits) {
        if (this._falling) {
            return;
        }
        if (keyBits === this._keyBits && this._applyDeferredMovement()) {
            return;
        }
        this._keyBits = keyBits;
        let moves = movement.get(keyBits);
        if (moves) {
            this._move(moves[0], moves[1], moves[2], moves[3]);
        }
    }

    _move(direction, mx, my, diagonal) {
        // check requested movement falls within map boundary
        var newRect = this._rect.move(mx, my);
        if (this._playMap.isMapBoundaryBreached(newRect)) {
            return;
        }

        // check requested movement is valid
        let newBaseRect = this._baseRect.move(mx, my);
        let [valid, level] =  this._playMap.isMoveValid(this._level, newBaseRect);
        if (valid) {
            if (diagonal) {
                if (this._deferDiagonal) {
                    this._deferDiagonal = false;
                    this._deferMovement(direction, level, mx, my);
                    return;
                }
            }
            this._deferDiagonal = true;
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
        let [valid, level, shuffle] = this._playMap.isVerticalValid(this._level, this._baseRect);
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

    _applyDeferredMovement() {
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
        // update rects
        // console.log(this._baseRect + " : " + this._rect);
        this._level = level;
        this._rect = rect;
        // update sprite frames
        this._canvas = this._frames.advanceFrame(direction);
    }

    update(viewRect, mapSprites) {
        if (this._falling) {
            this._continueFalling();
            return;
        }
        let event = this._playMap.getEvent(this._level, this._baseRect);
        if (event && event.eventType === 'falling') {
            this._startFalling(mapSprites, event.downLevel);
        }
    }

    /**
     * Starts falling by switching frames and adding a shadow to game sprites.
     */
    _startFalling(mapSprites, downLevel) {
        console.log('down: ' + downLevel);
        this._falling = downLevel * tileSize;
        this._frames = this._fallingFrames.withFrameIndex(this._frames.getFrameIndex());
        this._shadow = new Shadow(this._playMap, this._shadowFrames);
        this._shadow.setPosition(this._rect, this._level, downLevel);
        mapSprites.add(this._shadow);
    }

    /**
     * Continues falling + detects if falling is complete.
     */
    _continueFalling() {
        this._applyMovement(down, this._level, 0, fallUnit);
        if (this._falling % tileSize === 0) {
            this._level -= 1;
        }
        this._falling -= fallUnit;
        if (this._falling > 0) {
            return;
        }
        // falling is complete - swap back to moving frames
        this._frames = this._movingFrames;
        this._canvas = this._frames.currentFrame();
        this._shadow.removeOnNextTick();
    }

    handleCollisions(mapSprites, lifeLostFunc) {
        let lifeLost = mapSprites.getVisibleSprites()
            .filter(sprite => this._level === sprite.getLevel() &&
                this._baseRect.intersectsWith(sprite.getBaseRect()))
            .some(sprite => sprite.processCollision()); // processCollision returns true if player has lost a life
        if (lifeLost) {
            lifeLostFunc();
        }
    }
}