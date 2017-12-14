import React from 'react';
import { Alert, ButtonToolbar, ToggleButtonGroup, ToggleButton, Checkbox, Collapse, FormGroup, Modal } from 'react-bootstrap';
import { viewWidth, viewHeight } from '../config';
import Stage from './stage';
import './play-modal.css';

const fps = 60;

/* =============================================================================
 * COMPONENT: PLAY MAP MODAL
 * =============================================================================
 */
export const PlayMapModal = React.createClass({
    _canvas: null,
    _stage: null,

    _requestId: null, // only set if using requestAnimationFrame
    _intervalId: null, // only set if using setInterval

    getInitialState: function() {
        return {
            rpgMap: null,
            modeVal: 'live'
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
        this._stage = null;
        this.props.onClose();
        this.setState({
            playReady: false,
            playError: false
        });
    },

    handleModeChange: function(value) {
        this.setState({ modeVal: value })
        if (this._stage) {
            this._stage.setLiveMode(this.isLive(value));
        }
    },

    isLive: function(value) {
        return (value === 'live');
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
        if (this.state.rpgMap && !this._stage) {
            let liveMode = this.isLive(this.state.modeVal);
            this._stage = new Stage(this.state.rpgMap, this.props.level,
                this.props.tilePosition.x, this.props.tilePosition.y, liveMode);
            let p = this._stage.initPlay();
            p.then(
                () => {
                    let onEachFrame = this.assignOnEachFrame();
                    onEachFrame(() => this._stage.executeMain(this._canvas, this._keys));
                    this.setState({
                        playReady: true,
                        playError: false
                    });
                },
                data => this.setState({ playReady: false, playError: data.err })
            ).done();
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

    keyDown: function(e) {
        e.preventDefault();
        this._stage.keyDown(e.keyCode);
    },

    keyUp: function(e) {
        e.preventDefault();
        this._stage.keyUp(e.keyCode);
    },

    modalBody: function() {
        if (this.props.showModal && this.state.rpgMap) {
            let showError = this.state.playError && this.state.playError.length > 0;
            return (
                <Modal.Body>
                    <Collapse in={showError}>
                        <div>
                            <Alert bsStyle="danger">Could not initiate play mode: {this.state.playError}</Alert>
                        </div>
                    </Collapse>
                    <Collapse in={this.state.playReady}>
                        <div>
                            <canvas className="play-canvas" width={viewWidth} height={viewHeight}
                                ref={cvs => this._canvas = cvs} />
                        </div>
                    </Collapse>
                    <ButtonToolbar className="play-buttons">
                        <ToggleButtonGroup type="radio"
                                           name="options"
                                           value={this.state.modeVal}
                                           onChange={this.handleModeChange}
                                           justified>
                            <ToggleButton type="radio" value={'live'}>Live Mode</ToggleButton>
                            <ToggleButton type="radio" value={'test'}>Test Mode</ToggleButton>
                        </ToggleButtonGroup>
                    </ButtonToolbar>
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
