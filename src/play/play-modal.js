import React from 'react';
import { Modal } from 'react-bootstrap';
import { tileSize, viewWidth, viewHeight } from '../config';
import { initRect, Rect } from '../utils';
import PlayMap from './play-map';
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

const baseRectWidth = 24,
      baseRectHeight = 18,
      baseRectExtension = 2;

/* =============================================================================
 * COMPONENT: PLAY MAP MODAL
 * =============================================================================
 */
export const PlayMapModal = React.createClass({
    _canvas: null,
    _fullMapCanvas: null,
    _playMap: null,

    _playerCanvas: null,
    _playerBackground: null,
    _playerRect: null,
    _playerLevel: null,
    _baseRect: null,

    _keysDown: null,
    _keysUp: [],
    _directionBits: 0,
    _deferredMovement: null,

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

    viewMap: function(playerRect) {
        // var tlx = Math.max(0, px + (tileSize / 2) - (viewWidth / 2));
        // var tly = Math.max(0, py + (tileSize / 2) - (viewHeight / 2));
        var tlx = Math.max(0, playerRect.left + (playerRect.width / 2) - (viewWidth / 2));
        var tly = Math.max(0, playerRect.top + (playerRect.height / 2) - (viewHeight / 2));
        tlx = Math.min(tlx, this._fullMapCanvas.width - viewWidth);
        tly = Math.min(tly, this._fullMapCanvas.height - viewHeight);
        var viewCtx = this._canvas.getContext('2d');
        viewCtx.drawImage(this._fullMapCanvas, tlx, tly, viewWidth, viewHeight, 0, 0, viewWidth, viewHeight);
    },

    initPlayer: function(tx, ty) {
        var px = tx * tileSize + marginX;
        var py = ty * tileSize + marginY;
        this._playerRect = new Rect(px, py, playerWidth, playerHeight);
        py = this._playerRect.bottom + baseRectExtension - baseRectHeight;
        this._baseRect = new Rect(px, py, baseRectWidth, baseRectHeight);
        this._playerLevel = this._playMap.getValidLevel(tx, ty);
        this._playerCanvas = initRect("#FF0000", playerWidth, playerHeight);
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
            this._playMap = new PlayMap(this.state.rpgMap);
            // this._px = this.props.tilePosition.x * tileSize + marginX;
            // this._py = this.props.tilePosition.y * tileSize + marginY;
            this.initPlayer(this.props.tilePosition.x, this.props.tilePosition.y);
            this._playerBackground = this.showPlayer(this._fullMapCanvas.getContext('2d'));
            this.viewMap(this._playerRect);
            this.playLoop();
        }
    },

    playLoop: function() {
        if (!this.props.showModal) {
            return;
        }
        // console.log("play loop called: " + this._direction);
        var directionBits = this.processKeysDown();
        if (this._deferredMovement && directionBits === this._directionBits) {
            this.applyDeferredMovement();
        }
        else {
            this._directionBits = directionBits;
            var movement = this.getMovement(directionBits);
            if (movement) {
                //console.log(this._px + ":" + this._py);
                this.movePlayer(movement[0], movement[1]);
                this.viewMap(this._playerRect);
            }
        }
        this.processKeysUp();
        setTimeout(this.playLoop, 17);
    },

    applyDeferredMovement() {
        var [level, mx, my] = this._deferredMovement;
        this.applyMovement(level, mx, my);
    },

    applyMovement: function(newLevel, mx, my) {
        this._baseRect.moveInPlace(mx, my);
        this.performMovement(newLevel, mx, my)
    },

    applyMovementWithBaseRect(newLevel, mx, my, newBaseRect) {
        this._baseRect = newBaseRect;
        this.performMovement(newLevel, mx, my)
    },

    performMovement: function (newLevel, mx, my) {
        // restore background of current position
        var ctx = this._fullMapCanvas.getContext('2d');
        this._restoreBackground(ctx);
        // perform movement
        this._playerRect.moveInPlace(mx, my);
        // console.log(this._baseRect);
        // console.log(this._playerRect);
        this._playerLevel = newLevel;
        // draw player in new position
        this._playerBackground = this.showPlayer(ctx);
        // reset deferred movement
        this._deferredMovement = null;
    },

    deferMovement: function(newLevel, mx, my) {
        this._deferredMovement = [newLevel, mx, my];
    },

    movePlayer: function(mx, my) {
        var newBaseRect = this._baseRect.move(mx, my);

        // check requested movement falls within map boundary
        if (this._playMap.isMapBoundaryBreached(newBaseRect)) {
            return;
        }

        // check requested movement is valid
        var [moveValid, newLevel] =  this._playMap.isMoveValid(this._playerLevel, newBaseRect);
        if (moveValid) {
            this.applyMovementWithBaseRect(newLevel, mx, my, newBaseRect);
            return;
        }

        // movement invalid but we might be able to slide or shuffle
        if (mx === 0 || my === 0) {
            if (this._shuffle(mx, my)) {
                return;
            }
        }
        else {
            // diagonal movement
            if (this._slide(mx, my)) {
                return;
            }
        }

        // movement invalid - apply a stationary change of direction if needed
    },

    _shuffle(mx, my) {
        // check if we can shuffle horizontally
        if (mx === 0) {
            var [valid, level, shuffle] = this._playMap.isVerticalValid(this._playerLevel, this._baseRect);
            if (valid) {
                this.deferMovement(level, shuffle, 0);
            }
            return valid;
        }
        // check if we can shuffle vertically
        [valid, level, shuffle] = this._playMap.isHorizontalValid(this._playerLevel, this._baseRect);
        if (valid) {
            this.deferMovement(level, 0, shuffle);
        }
        return valid;
    },

    // def shuffle(self, movement):
    //     px, py, direction, diagonal = movement
    //     # check if we can shuffle horizontally
    //     if px == 0:
    //         valid, level, shuffle = self.rpgMap.isVerticalValid(self.level, self.baseRect)
    //         if valid:
    //             self.deferMovement(level, direction, px + shuffle * MOVE_UNIT, 0)
    //         return valid
    //     # check if we can shuffle vertically
    //     valid, level, shuffle = self.rpgMap.isHorizontalValid(self.level, self.baseRect)
    //     if valid:
    //         self.deferMovement(level, direction, 0, py + shuffle * MOVE_UNIT)
    //     return valid

    _slide(mx, my) {
        var newBaseRect = this._baseRect.move(mx, 0);
        var [moveValid, newLevel] =  this._playMap.isMoveValid(this._playerLevel, newBaseRect);
        if (moveValid) {
            this.deferMovement(newLevel, mx, 0);
            return moveValid;
        }
        newBaseRect = this._baseRect.move(0, my);
        [moveValid, newLevel] =  this._playMap.isMoveValid(this._playerLevel, newBaseRect);
        if (moveValid) {
            this.deferMovement(newLevel, 0, my);
        }
        return moveValid;
    },
    // def slide(self, movement):
    //     px, py, direction, diagonal = movement
    //     # check if we can slide horizontally
    //     xBaseRect = self.baseRect.move(px, 0)
    //     valid, level = self.rpgMap.isMoveValid(self.level, xBaseRect)
    //     if valid:
    //         self.deferMovement(level, direction, px, 0)
    //         return valid
    //     # check if we can slide vertically
    //     yBaseRect = self.baseRect.move(0, py)
    //     valid, level = self.rpgMap.isMoveValid(self.level, yBaseRect)
    //     if valid:
    //         self.deferMovement(level, direction, 0, py)
    //     return valid

    _restoreBackground(ctx) {
        ctx.putImageData(this._playerBackground, this._playerRect.left, this._playerRect.top);
    },

    showPlayer: function(ctx) {
        var background = ctx.getImageData(this._playerRect.left, this._playerRect.top,
                this._playerRect.width, this._playerRect.height);
        ctx.drawImage(this._playerCanvas, this._playerRect.left, this._playerRect.top);
        return background;
    },

    keyDown: function(e) {
        // console.log("DOWN: " + e.keyCode);
        if (e.keyCode < 128) {
            this._keysDown[e.keyCode] = true;
        }
    },

    keyUp: function(e) {
        // console.log("UP: " + e.keyCode);
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
