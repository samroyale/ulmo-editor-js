import React from 'react';
import { Modal } from 'react-bootstrap';
import { tileSize, viewWidth, viewHeight } from '../config';
import { drawTile, initTile } from '../utils';
import { Keys, Player } from './player';
import PlayMap from './play-map';
import './play-modal.css';

const fps = 60;

/* =============================================================================
 * COMPONENT: PLAY MAP MODAL
 * =============================================================================
 */
export const PlayMapModal = React.createClass({
    _canvas: null,
    _fullMapCanvas: null,
    _onEachFrame: null,
    _requestId: null, // only set if using requestAnimationFrame
    _intervalId: null, // only set if using setInterval

    _player: null,

    _keys: null,
    _keyBits: 0,

    getInitialState: function() {
        return {
            rpgMap: null
        };
    },

    drawMap: function() {
        var mapCanvas = document.createElement("canvas");
        var cols = this.state.rpgMap.getCols();
        var rows = this.state.rpgMap.getRows();
        mapCanvas.width = cols * tileSize;
        mapCanvas.height = rows * tileSize;
        var ctx = mapCanvas.getContext('2d');
        for (var x = 0; x < cols; x++) {
            for (var y = 0; y < rows; y++) {
                var tileCanvas = drawTile(this.state.rpgMap.getMapTile(x, y).getMaskTiles(), initTile('black'));
                ctx.drawImage(tileCanvas, x * tileSize, y * tileSize);
            }
        }
        return mapCanvas;
    },

    _viewMap: function(playerRect) {
        var tlx = Math.max(0, playerRect.left + (playerRect.width / 2) - (viewWidth / 2));
        var tly = Math.max(0, playerRect.top + (playerRect.height / 2) - (viewHeight / 2));
        tlx = Math.min(tlx, this._fullMapCanvas.width - viewWidth);
        tly = Math.min(tly, this._fullMapCanvas.height - viewHeight);
        var viewCtx = this._canvas.getContext('2d');
        viewCtx.drawImage(this._fullMapCanvas,
            tlx < 0 ? tlx / 2 : tlx, tly < 0 ? tly / 2 : tly, viewWidth, viewHeight,
            0, 0, viewWidth, viewHeight);
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
        this._fullMapCanvas = null;
        this.props.onClose();
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
        if (this.state.rpgMap && !this._fullMapCanvas) {
            this._keys = new Keys();
            this._fullMapCanvas = this.drawMap();
            var playMap = new PlayMap(this.state.rpgMap);
            this._player = new Player(playMap, this.props.tilePosition.x, this.props.tilePosition.y)
            this._player.showPlayer(this._fullMapCanvas.getContext('2d'));
            this._viewMap(this._player.getRect());
            this._onEachFrame = this.assignOnEachFrame();
            this._onEachFrame(this.playMain());
        }
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

    /*
     * Simple version of playMain
     */
    playMain: function() {
        return () => {
            this._playUpdate();
            this._viewMap(this._player.getRect());
        };
    },

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
    //         this._viewMap(this._player.getRect());
    //     };
    // },

    _playUpdate: function() {
        var keyBits = this._keys.processKeysDown();
        var mapCtx = this._fullMapCanvas.getContext('2d');
        if (keyBits === this._keyBits && this._player.applyDeferredMovement(mapCtx)) {
            return;
        }
        this._keyBits = keyBits;
        var movement = this._keys.getMovement(keyBits);
        if (movement) {
            //console.log(this._px + ":" + this._py);
            this._player.move(movement[0], movement[1], mapCtx);
        }
    },

    keyDown: function(e) {
        this._keys.keyDown(e.keyCode);
    },

    keyUp: function(e) {
        this._keys.keyUp(e.keyCode);
    },

    modalBody: function() {
        if (this.props.showModal && this.state.rpgMap) {
            return (
                <Modal.Body>
                    <canvas className="play-canvas" width={viewWidth} height={viewHeight}
                            ref={cvs => this._canvas = cvs} />
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
