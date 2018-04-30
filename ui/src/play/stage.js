import { SpriteGroup, Beetle, Blades, Checkpoint, Coin, Door, Flames, Key, Rock, Wasp } from './sprites';
import { copyCanvas, initRect } from '../utils';
import { viewWidth, viewHeight } from '../config';
import { Keys, Player } from './player';
import PlayMap from './play-map';

const spriteProvider = new Map([
    ['flames', (playMap, sprite) => new Flames(playMap, sprite.getLevel(), sprite.getLocation())],
    ['key', (playMap, sprite) => new Key(playMap, sprite.getLevel(), sprite.getLocation())],
    ['rock', (playMap, sprite) => new Rock(playMap, sprite.getLevel(), sprite.getLocation())],
    ['coin', (playMap, sprite) => new Coin(playMap, sprite.getLevel(), sprite.getLocation())],
    ['beetle', (playMap, sprite) => new Beetle(playMap, sprite.getLevel(), sprite.getLocation())],
    ['wasp', (playMap, sprite) => new Wasp(playMap, sprite.getLevel(), sprite.getLocation())],
    ['door', (playMap, sprite) => new Door(playMap, sprite.getLevel(), sprite.getLocation())],
    ['blades', (playMap, sprite) => new Blades(playMap, sprite.getLevel(), sprite.getLocation())],
    ['checkpoint', (playMap, sprite) => new Checkpoint(playMap, sprite.getLevel(), sprite.getLocation())]
]);

const blackScreen = initRect('black', viewWidth, viewHeight);

const xMultiplier = viewWidth / 64;
const yxRatio = viewHeight / viewWidth;

/* =============================================================================
 * CLASS: STAGE
 * -----------------------------------------------------------------------------
 * Provides the entry point into the game engine
 * =============================================================================
 */
class Stage {
    constructor(rpgMap, playerLevel, playerX, playerY, liveMode) {
        this._rpgMap = rpgMap;
        this._playerLevel = playerLevel;
        this._playerX = playerX;
        this._playerY = playerY;
        this._liveMode = liveMode;
        this._playMap = null;
        this._player = null;
        this._mapSprites = null;
        this._canvasCopy = null;
        this._keys = null;
        this._ticks = 0;
        this._execute = this._executePlay;
    }

    initPlay() {
        this._playMap = new PlayMap(this._rpgMap);
        this._player = new Player(this._playMap, this._playerLevel,
            this._playerX, this._playerY);
        let sprites = this._toGameSprites(this._rpgMap.getSprites());
        sprites.push(this._player);
        let spritePromises = sprites.map(sprite => sprite.load());
        let p = Promise.all(spritePromises);
        return p.then(() => {
            this._keys = new Keys();
            this._mapSprites = new SpriteGroup();
            this._mapSprites.addAll(sprites);
        });
    }

    _toGameSprites(sprites) {
        if (!sprites) {
            return [];
        }
        let gameSprites = [];
        sprites.forEach(sprite => {
            let spriteFunc = spriteProvider.get(sprite.getType());
            if (spriteFunc) {
                gameSprites.push(spriteFunc(this._playMap, sprite));
            }
        });
        return gameSprites;
    }

    /*
     * Using the _execute function as a lightweight state - this will
     * reference either _executePlay or _executeLoseLife.
     */
    executeMain(...args) {
        this._execute(...args);
    }

    _executePlay(canvas) {
        // update stuff
        let viewRect = this._player.handleInput(this._keys.processKeysDown());
        this._mapSprites.update(viewRect, this._mapSprites, this._player, true);
        // render the view
        let viewCtx = canvas.getContext('2d');
        this._playMap.drawView(viewCtx, viewRect);
        this._mapSprites.draw(viewCtx, viewRect);
        // see if player collided with anything
        this._player.handleCollisions(this._mapSprites, () => {
            if (this._liveMode) {
                this._ticks = 0;
                this._canvasCopy = copyCanvas(canvas);
                this._execute = this._executeLoseLife;
            }
        });
    }

    _executeLoseLife(canvas) {
        if (this._ticks < 64) {
            if (this._ticks === 32) {
                this._execute = () => {}; // temporary state
                let p = this.initPlay();
                p.then(() => {
                    let viewRect = this._player.handleInput();
                    this._mapSprites.update(viewRect, this._mapSprites, this._player);
                    let copyCtx = this._canvasCopy.getContext('2d');
                    this._playMap.drawView(copyCtx, viewRect);
                    this._mapSprites.draw(copyCtx, viewRect);
                    this._execute = this._executeLoseLife;
                });
            }
            let viewCtx = canvas.getContext('2d');
            this._applyZoom(viewCtx, this._ticks);
            this._ticks++;
            return;
        }
        this._execute = this._executePlay;
    }

    _applyZoom(viewCtx, ticks) {
        let xBorder = (ticks + 1) * xMultiplier;
        let yBorder = xBorder * yxRatio;
        if (ticks < 32) {
            viewCtx.drawImage(blackScreen, 0, 0);
        }
        let extractWidth = viewWidth - xBorder * 2;
        let extractHeight = viewHeight - yBorder * 2;
        viewCtx.drawImage(this._canvasCopy,
            xBorder, yBorder, extractWidth, extractHeight,
            xBorder, yBorder, extractWidth, extractHeight);
    }

    keyDown(keyCode) {
        this._keys.keyDown(keyCode);
    }

    keyUp(keyCode) {
        this._keys.keyUp(keyCode);
    }

    setLiveMode(liveMode) {
        this._liveMode = liveMode;
    }
}

export default Stage;