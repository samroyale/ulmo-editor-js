import React from 'react';
import { Modal } from 'react-bootstrap';
import { tileSize, viewWidth, viewHeight } from '../config';
import { initRect } from '../utils';
import './play-modal.css';

const upKey = 38, downKey = 40, leftKey = 37, rightKey = 39;

const up = 1, down = 2, left = 4, right = 8;

const movement = new Map([
    [up, [0, -2]],
    [down, [0, 2]],
    [left, [-2, 0]],
    [right, [2, 0]],
    [up + left, [-2, -2]],
    [up + right, [2, -2]],
    [down + left, [-2, 2]],
    [down + right, [2, 2]]
]);

const playerWidth = 24,
      playerHeight = 36,
      marginX = (tileSize - playerWidth) / 2,
      marginY = (tileSize * 2 - playerHeight) / 2;

/* =============================================================================
 * COMPONENT: PLAY MAP MODAL
 * =============================================================================
 */
export const PlayMapModal = React.createClass({
    _canvas: null,
    _fullMapCanvas: null,
    _playerCanvas: null,
    _playerBackground: null,

    _px: null, _py: null,
    _keysDown: null,
    _keysUp: [],

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
                ctx.putImageData(this.state.rpgMap.getMapTile(x, y).getImage(), x * tileSize, y * tileSize);
            }
        }
        return mapCanvas;
    },

    viewMap: function(px, py) {
        // var tlx = Math.max(0, px + (tileSize / 2) - (viewWidth / 2));
        // var tly = Math.max(0, py + (tileSize / 2) - (viewHeight / 2));
        var tlx = Math.max(0, px + (playerWidth / 2) - (viewWidth / 2));
        var tly = Math.max(0, py + (playerHeight / 2) - (viewHeight / 2));
        tlx = Math.min(tlx, this._fullMapCanvas.width - viewWidth);
        tly = Math.min(tly, this._fullMapCanvas.height - viewHeight);
        var viewCtx = this._canvas.getContext('2d');
        viewCtx.drawImage(this._fullMapCanvas, tlx, tly, viewWidth, viewHeight, 0, 0, viewWidth, viewHeight);
    },

    initPlayer: function() {
        return initRect("#FF0000", playerWidth, playerHeight);
    },

    closeModal() {
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
            this._keysDown = Array(128).fill(false);
            this._fullMapCanvas = this.drawMap();
            this._playerCanvas = this.initPlayer();
            this._px = this.props.tilePosition.x * tileSize + marginX;
            this._py = this.props.tilePosition.y * tileSize + marginY;
            this._playerBackground = this.showPlayer(this._fullMapCanvas.getContext('2d'));
            this.viewMap(this._px, this._py);
            this.playLoop();
        }
    },

    playLoop: function() {
        if (!this.props.showModal) {
            return;
        }
        // console.log("play loop called: " + this._direction);
        var movement = this.getMovement(this.processKeysDown());
        if (movement) {
            //console.log(this._px + ":" + this._py);
            this.movePlayer(movement[0], movement[1]);
            this.viewMap(this._px, this._py);
        }
        this.processKeysUp();
        setTimeout(this.playLoop, 17);
    },

    movePlayer: function(mx, my) {
        if (!this.isMovementValid(mx, my)) {
            return;
        }
        // restore background of current position
        var ctx = this._fullMapCanvas.getContext('2d');
        ctx.putImageData(this._playerBackground, this._px, this._py);
        // perform movement
        this._px += mx;
        this._py += my;
        // draw player in new position
        this._playerBackground = this.showPlayer(ctx);
    },

    isMovementValid: function(mx, my) {
        var newPx = this._px + mx;
        if ((newPx < 0) || (newPx + playerWidth > this._fullMapCanvas.width)) {
            return false;
        }
        var newPy = this._py + my;
        if ((newPy < 0) || (newPy + playerHeight > this._fullMapCanvas.height)) {
            return false;
        }
        return true;
    },

    showPlayer: function(ctx) {
        var background = ctx.getImageData(this._px, this._py, playerWidth, playerHeight);
        ctx.drawImage(this._playerCanvas, this._px, this._py);
        return background;
    },

    keyDown: function(e) {
        console.log("DOWN: " + e.keyCode);
        if (e.keyCode < 128) {
            this._keysDown[e.keyCode] = true;
        }
    },

    keyUp: function(e) {
        console.log("UP: " + e.keyCode);
        if (e.keyCode < 128) {
            this._keysUp.push(e.keyCode);
        }
    },

    processKeysDown: function() {
        var directionBits = 0;
        if (this._keysDown[upKey]) {
            directionBits += up;
        }
        if (this._keysDown[downKey]) {
            directionBits += down;
        }
        if (this._keysDown[leftKey]) {
            directionBits += left;
        }
        if (this._keysDown[rightKey]) {
            directionBits += right;
        }
        return directionBits;
    },

    getMovement: function(directionBits) {
        return movement.get(directionBits);
    },

    processKeysUp: function() {
        if (this._keysUp.length === 0) {
            return;
        }
        this._keysUp.forEach(k => this._keysDown[k] = false);
        this._keysUp = [];
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
