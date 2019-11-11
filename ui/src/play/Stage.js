import { SpriteGroup, Beetle, Blades, Checkpoint, Coin, Door, Flames, Key, Rock, Wasp } from './Sprites';
import { copyCanvas, initRect } from '../utils';
import { viewWidth, viewHeight } from '../config';
import { Keys, Player } from './Player';
import PlayMap from './PlayMap';

const spriteProvider = {
    'rock': Rock.loadSprite,
    'flames': Flames.loadSprite,
    'key': Key.loadSprite,
    'coin': Coin.loadSprite,
    'door': Door.loadSprite,
    'checkpoint': Checkpoint.loadSprite,
    'beetle': Beetle.loadSprite,
    'wasp': Wasp.loadSprite,
    'blades': Blades.loadSprite
};

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

    async initPlay() {
        this._playMap = new PlayMap(this._rpgMap);
        const playerPromise = Player.loadSprite(
            this._playMap,
            this._playerLevel,
            [this._playerX, this._playerY]);
        const spritePromises = [playerPromise, ...this._spritePromises(this._rpgMap.getSprites())];
        try {
            const sprites = await Promise.all(spritePromises);
            this._player = sprites[0];
            this._keys = new Keys();
            this._mapSprites = new SpriteGroup();
            this._mapSprites.addAll(sprites);
        }
        catch (e) {
            console.log(e);
        }
    }

    _spritePromises(sprites) {
        if (!sprites) {
            return [];
        }
        return sprites.reduce((arr, sprite) => {
            const factoryFunc = spriteProvider[sprite.getType()];
            if (factoryFunc) {
                arr.push(factoryFunc(this._playMap, sprite.getLevel(), sprite.getLocation()));
            }
            return arr;
        }, [])
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
        const viewRect = this._player.handleInput(this._keys.processKeysDown());
        this._mapSprites.update(viewRect, this._mapSprites, this._player, true);
        // render the view
        const viewCtx = canvas.getContext('2d');
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
                const p = this.initPlay();
                p.then(() => {
                    const viewRect = this._player.handleInput();
                    this._mapSprites.update(viewRect, this._mapSprites, this._player);
                    const copyCtx = this._canvasCopy.getContext('2d');
                    this._playMap.drawView(copyCtx, viewRect);
                    this._mapSprites.draw(copyCtx, viewRect);
                    this._execute = this._executeLoseLife;
                });
            }
            const viewCtx = canvas.getContext('2d');
            this._applyZoom(viewCtx, this._ticks);
            this._ticks++;
            return;
        }
        this._execute = this._executePlay;
    }

    _applyZoom(viewCtx, ticks) {
        const xBorder = (ticks + 1) * xMultiplier;
        const yBorder = xBorder * yxRatio;
        if (ticks < 32) {
            viewCtx.drawImage(blackScreen, 0, 0);
        }
        const extractWidth = viewWidth - xBorder * 2;
        const extractHeight = viewHeight - yBorder * 2;
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