import Q from 'q';
import React from 'react';
import { Alert, Collapse, Modal } from 'react-bootstrap';
import { viewWidth, viewHeight } from '../config';
import { copyCanvas, initRect } from '../utils';
import { Keys, Player } from './player';
import { SpriteGroup, Beetle, Blades, Checkpoint, Coin, Door, Flames, Key, Rock, Wasp } from './sprites';
import PlayMap from './play-map';
import './play-modal.css';

const fps = 60;

export const spriteProvider = new Map([
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

const xMultiplier = viewWidth / 64
const yxRatio = viewHeight / viewWidth;

/* =============================================================================
 * COMPONENT: PLAY MAP MODAL
 * =============================================================================
 */
export const PlayMapModal = React.createClass({
    _canvas: null,
    _player: null,
    _mapSprites: null,
    _keys: null,

    _requestId: null, // only set if using requestAnimationFrame
    _intervalId: null, // only set if using setInterval

    _execute: null,
    _canvasCopy: null,
    _ticks: 0,

    getInitialState: function() {
        return {
            rpgMap: null
        };
    },

    closeModal() {
        if (this._requestId) {
            window.cancelAnimationFrame(this._requestId);
            this._requestId = null;
        }
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
        this._player = null;
        this.props.onClose();
        this.setState({
            playReady: false,
            playError: false
        });
    },

    componentWillMount: function() {
        this.populateStateFromProps(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
        this.populateStateFromProps(nextProps);
    },

    populateStateFromProps: function(props) {
        if (props.showModal) {
            this.setState({ rpgMap: props.rpgMap });
        }
    },

    componentDidUpdate: function(oldProps, oldState) {
        if (!this.props.showModal) {
            return;
        }
        if (this.state.rpgMap && !this._player) {
            this._initPlay(this.executePlay);
        }
    },

    _initPlay(executeFunc) {
        this._keys = new Keys();
        let playMap = new PlayMap(this.state.rpgMap);
        this._player = new Player(playMap, this.props.level,
            this.props.tilePosition.x, this.props.tilePosition.y);
        let sprites = this._toGameSprites(this.state.rpgMap.getSprites());
        sprites.push(this._player);
        let spritePromises = sprites.map(sprite => sprite.load());
        let p = Q.all(spritePromises);
        p.then(
            () => this.playReady(sprites, executeFunc),
            data => this.setState({ playReady: false, playError: data.err })
        ).done();
    },

    playReady(sprites, executeFunc) {
        this._mapSprites = new SpriteGroup();
        this._mapSprites.addAll(sprites);
        this._execute = executeFunc;
        let onEachFrameFunc = this.assignOnEachFrame();
        onEachFrameFunc(this.executeMain);
        this.setState({
            playReady: true,
            playError: false
        });
    },

    _toGameSprites(sprites) {
        if (!sprites) {
            return;
        }
        let gameSprites = [];
        sprites.forEach(sprite => {
            let func = spriteProvider.get(sprite.getType());
            if (func) {
                gameSprites.push(func(this._player.getPlayMap(), sprite));
            }
        });
        return gameSprites;
    },
    
    assignOnEachFrame() {
        if (window.requestAnimationFrame) {
            console.log('Using requestAnimationFrame');
            return (cb) => {
                var _cb = () => {
                    cb();
                    this._requestId = window.requestAnimationFrame(_cb);
                }
                _cb();
            };
        }
        console.log('Using setInterval');
        return (cb) => {
            this._intervalId = setInterval(cb, 1000 / fps);
        }
    },

    executeMain: function() {
        this._execute();
    },

    /*
     * Simple version of playMain
     */
    executePlay: function() {
//        return () => {
            // update stuff
            let viewRect = this._player.handleInput(this._keys.processKeysDown());
            this._mapSprites.update(viewRect, this._mapSprites, this._player);
            // render the view
            let viewCtx = this._canvas.getContext('2d');
            this._player.drawMapView(viewCtx, viewRect);
            this._mapSprites.draw(viewCtx, viewRect);
            this._player.handleCollisions(this._mapSprites, () => {
                this._ticks = 0;
                this._canvasCopy = copyCanvas(this._canvas);
                this._execute = this.executeLoseLife;
            });
//        };
    },

    executeLoseLife: function() {
        let viewCtx = this._canvas.getContext('2d');
        // this.sceneZoomIn(viewCtx, this._ticks);
        // if (this._ticks < 32) {
        //     this.sceneZoomIn(viewCtx, this._ticks);
        // }
        if (this._ticks < 64) {
            if (this._ticks === 32) {
                console.log('Reset play');
            }
            this.sceneZoomIn(viewCtx, this._ticks);
        }
        else {
            console.log('DONE');
        }
        this._ticks++;
    },

    sceneZoomIn: function(viewCtx, ticks) {
        let xBorder = (ticks + 1) * xMultiplier;
        let yBorder = xBorder * yxRatio;
        viewCtx.drawImage(blackScreen, 0, 0);
        let extractWidth = viewWidth - xBorder * 2;
        let extractHeight = viewHeight - yBorder * 2;
        viewCtx.drawImage(this._canvasCopy,
            xBorder, yBorder, extractWidth, extractHeight,
            xBorder, yBorder, extractWidth, extractHeight);
    },
// xBorder = (ticks + 1) * X_MULT
// yBorder = xBorder * Y_X_RATIO
// screen.blit(blackRect, ORIGIN)
// extract = Rect(xBorder, yBorder, VIEW_WIDTH - xBorder * 2, VIEW_HEIGHT - yBorder * 2)
// screen.blit(screenImage, (xBorder, yBorder), extract)
// pygame.display.flip()
//
// def sceneZoomOut(screenImage, ticks):
// xBorder = (THIRTY_TWO - (ticks + 1)) * X_MULT
// yBorder = xBorder * Y_X_RATIO
// extract = Rect(xBorder, yBorder, VIEW_WIDTH - xBorder * 2, VIEW_HEIGHT - yBorder * 2)
// screen.blit(screenImage, (xBorder, yBorder), extract)
// pygame.display.flip()

/*
 * Alternative version of playMain, that attempts to apply consistent updates
 * even when the framerate drops below the specified level.
 */
    // playMain: function() {
    //     console.log("playMain");
    //     var i = 0,
    //         skipTicks = 1000 / fps,
    //         maxFrameSkip = 10,
    //         nextGameTick = new Date().getTime();
    //
    //     return () => {
    //         i = 0;
    //
    //         while (new Date().getTime() > nextGameTick && i < maxFrameSkip) {
    //             this._playUpdate();
    //             nextGameTick += skipTicks;
    //             i++;
    //         }
    //
    //         this._renderView();
    //     };
    // },
    
    keyDown: function(e) {
        this._keys.keyDown(e.keyCode);
    },

    keyUp: function(e) {
        this._keys.keyUp(e.keyCode);
    },

    modalBody: function() {
        if (this.props.showModal && this.state.rpgMap) {
            let showError = this.state.playError && this.state.playError.length > 0;
            return (
                <Modal.Body>
                    <Collapse in={showError}>
                        <div>
                            <Alert bsStyle="danger">{this.state.playError}</Alert>
                        </div>
                    </Collapse>
                    <Collapse in={this.state.playReady}>
                        <div>
                            <canvas className="play-canvas" width={viewWidth} height={viewHeight}
                                ref={cvs => this._canvas = cvs} />
                        </div>
                    </Collapse>
                </Modal.Body>
            );
        }
        return <Modal.Body />
    },

    render: function() {
        return (
            <Modal show={this.props.showModal} onHide={this.closeModal} dialogClassName="play-map-modal" onKeyDown={this.keyDown} onKeyUp={this.keyUp}>
                <Modal.Header closeButton>
                    <Modal.Title>Play Map</Modal.Title>
                </Modal.Header>
                {this.modalBody()}
            </Modal>
        );
    }
});
