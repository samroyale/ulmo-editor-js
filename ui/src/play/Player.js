import { tileSize } from '../config';
import { Sprite, MovingFrames, StaticFrames, SingleFrame } from './Sprites';
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
} from './PlayConfig';

const playerFramesUrl = spritesImgPath + '/ulmo-frames.png';
const playerFallingFramesUrl = spritesImgPath + '/ulmo-falling.png';
const shadowFramesUrl = spritesImgPath + '/shadow.png';

// const deferralNone = 0;
const deferralDefault = 1;
const deferralDiagonal = 2;

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
    // };
}

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

    setRelativePosition(playerRect, playerLevel, downLevel) {
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
    constructor(playMap, level, location) {
        super(playMap, level, location[0], location[1], true);
        this._deferredMovement = null;
        this._keyBits = 0;
        this._deferDiagonal = true;
    }

    static async loadSprite(playMap, level, location) {
        const frames = await Promise.all([
            MovingFrames.loadFrames(playerFramesUrl, directions, 4, 6),
            StaticFrames.loadFrames(playerFallingFramesUrl, 4, 0),
            SingleFrame.loadFrames(shadowFramesUrl)
        ]);
        const sprite = new Player(playMap, level, location);
        return sprite._withPlayerFrames(frames, 0);
    }

    _withPlayerFrames([ movingFrames, fallingFrames, shadowFrames ]) {
        this._movingFrames = movingFrames;
        this._fallingFrames = fallingFrames;
        this._shadowFrames = shadowFrames;
        return this.withFrames(movingFrames);
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
        const moves = movement.get(keyBits);
        if (moves) {
            let [direction, mx, my] = moves;
            this._move(direction, mx, my);
        }
    }

    _move(direction, mx, my) {
        // check requested movement falls within map boundary
        const newRect = this._rect.move(mx, my);
        if (this._playMap.isMapBoundaryBreached(newRect)) {
            return;
        }

        const [valid, deferral, level, mx_delta, my_delta] = this._playMap.applyMove(mx, my, this._level, this._baseRect);
        if (valid) {
            if (deferral === deferralDefault) {
                this._deferMovement(direction, level, mx_delta, my_delta);
                return;
            }
            if (deferral === deferralDiagonal) {
                if (this._deferDiagonal) {
                    this._deferDiagonal = false;
                    this._deferMovement(direction, level, mx_delta, my_delta);
                    return;
                }
            }
            this._deferDiagonal = true;
            this._applyMovement(direction, level, mx_delta, my_delta);
            return;
        }

        // movement invalid - apply a stationary change of direction if needed
        if (this._frames.getDirection() !== direction) {
            this._moveInternal(direction, this._level, this._rect);
        }
    }

    // _shuffleX(direction) {
    //     // see if we can shuffle horizontally
    //     const [valid, level, shuffle] = this._playMap.isVerticalValid(this._level, this._baseRect);
    //     if (valid) {
    //         this._deferMovement(direction, level, shuffle, 0);
    //     }
    //     return valid;
    // }
    //
    // _shuffleY(direction) {
    //     // see if we can shuffle vertically
    //     const [valid, level, shuffle] = this._playMap.isHorizontalValid(this._level, this._baseRect);
    //     if (valid) {
    //         this._deferMovement(direction, level, 0, shuffle);
    //     }
    //     return valid;
    // }
    //
    // _slide(direction, mx, my) {
    //     // see if we can slide horizontally
    //     let newBaseRect = this._baseRect.move(mx, 0);
    //     let [valid, level] =  this._playMap.isMoveValid(this._level, newBaseRect);
    //     if (valid) {
    //         this._deferMovement(direction, level, mx, 0);
    //         return valid;
    //     }
    //     // see if we can slide vertically
    //     newBaseRect = this._baseRect.move(0, my);
    //     [valid, level] =  this._playMap.isMoveValid(this._level, newBaseRect);
    //     if (valid) {
    //         this._deferMovement(direction, level, 0, my);
    //     }
    //     return valid;
    // }

    _applyDeferredMovement() {
        if (this._deferredMovement) {
            const [direction, level, mx, my] = this._deferredMovement;
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

    // _applyRectMovement(direction, level, baseRect, rect) {
    //     this._baseRect = baseRect;
    //     this._moveInternal(direction, level, rect);
    // }

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
        const event = this._playMap.getEvent(this._level, this._baseRect);
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
        this._shadow.setRelativePosition(this._rect, this._level, downLevel);
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
