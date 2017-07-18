import React from 'react';
import { Alert, Collapse, Modal } from 'react-bootstrap';
import { viewWidth, viewHeight } from '../config';
import { Keys, Player } from './player';
import { SpriteGroup } from './sprites';
import PlayMap from './play-map';
import './play-modal.css';

const fps = 60;

/* =============================================================================
 * COMPONENT: PLAY MAP MODAL
 * =============================================================================
 */
export const PlayMapModal = React.createClass({
    _canvas: null,
    _player: null,
    _visibleSprites: null,
    _keys: null,

    _requestId: null, // only set if using requestAnimationFrame
    _intervalId: null, // only set if using setInterval

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
            let playMap = new PlayMap(this.state.rpgMap);
            let tx = this.props.tilePosition.x, ty = this.props.tilePosition.y;
            let level = playMap.getValidLevel(tx, ty);
            this._player = new Player(playMap, level, tx, ty);
            let p = this._player.load();
            p.then(this.playReady, data => {
                this.setState({
                    playReady: false,
                    playError: data.err
                });
            }).done();
        }
    },

    playReady() {
        this._visibleSprites = new SpriteGroup();
        this._visibleSprites.add(this._player);
        this._renderView();
        let onEachFrameFunc = this.assignOnEachFrame();
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
        let viewCtx = this._canvas.getContext('2d');
        let viewRect = this._player.drawMapView(viewCtx);
        this._visibleSprites.draw(viewCtx, viewRect);
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
        this._player.update(this._keys);
        // updating of other sprites should go here
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
