import Q from 'q';
import { copyCanvas, getDrawingContext, loadImage } from '../utils';
import { down, directions } from './play-config';

/* =============================================================================
 * CLASS: SPRITE FRAMES
 * =============================================================================
 */
export class SpriteFrames {
    constructor(imageUrl, directions, frameCount, frameTicks) {
        this._imageUrl = imageUrl;
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
        let index = this._sprites.indexOf(sprite);
        this._sprites.splice(index, 1);
    }

    update() {
        this._sprites.forEach(sprite => {
            sprite.update();
        });
    }

    draw() {
        this._sprites.forEach(sprite => {
            sprite.draw();
        });
    }
}
