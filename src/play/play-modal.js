import React from 'react';
import { Alert, Collapse, Modal } from 'react-bootstrap';
import { viewWidth, viewHeight } from '../config';
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
            this._keys = new Keys();
            var playMap = new PlayMap(this.state.rpgMap);
            this._player = new Player(playMap, this.props.tilePosition.x, this.props.tilePosition.y);
            var p = this._player.load();
            p.then(this.playReady, data => {
                this.setState({
                    playReady: false,
                    playError: data.err
                });
            });
        }
    },

    playReady() {
        this._player.show();
        this._renderView();
        var onEachFrameFunc = this.assignOnEachFrame();
        onEachFrameFunc(this.playMain());
        this.setState({
            playReady: true,
            playError: false
        });
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
            this._renderView();
        };
    },

    _renderView: function() {
        this._player.viewMap(this._canvas.getContext('2d'));
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
    //         this._renderView();
    //     };
    // },

    _playUpdate: function() {
        // TODO: most of the keys stuff should be in Player - the move function should take a keys argument
        var keyBits = this._keys.processKeysDown();
        if (keyBits === this._keyBits && this._player.applyDeferredMovement()) {
            return;
        }
        this._keyBits = keyBits;
        var movement = this._keys.getMovement(keyBits);
        if (movement) {
            this._player.move(movement[0], movement[1], movement[2]);
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
