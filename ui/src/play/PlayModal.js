import React from 'react';
import { Alert, ButtonToolbar, ToggleButtonGroup, ToggleButton, Collapse, Modal } from 'react-bootstrap';
import { viewWidth, viewHeight } from '../config';
import Stage from './Stage';
import './PlayModal.css';

const fps = 60;

/* =============================================================================
 * COMPONENT: PLAY MAP MODAL
 * =============================================================================
 */
export class PlayModal extends React.Component {
    constructor(props) {
        super(props);

        this._canvas = React.createRef();
        this._stage = null;
        this._requestId = null; // only set if using requestAnimationFrame
        this._intervalId = null; // only set if using setInterval

        this.state = {
            rpgMap: props.rpgMap,
            modeVal: 'live',
            playInit: false
        };
    }

    closeModal = () => {
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
    };

    handleModeChange = value => {
        this.setState({ modeVal: value });
        if (this._stage) {
            this._stage.setLiveMode(this.isLive(value));
        }
    };

    isLive = value => {
        return (value === 'live');
    };

    componentDidMount = () => {
        const { playInit } = this.state;
        if (!playInit) {
            // results in componentDidUpdate being called
            this.setState({
                playInit: true
            });
        }
    };

    componentDidUpdate = () => {
        const { level, tilePosition } = this.props;
        if (this.state.rpgMap && !this._stage) {
            let liveMode = this.isLive(this.state.modeVal);
            this._stage = new Stage(this.state.rpgMap, level,
                tilePosition.x, tilePosition.y, liveMode);
            let p = this._stage.initPlay();
            p.then(
                () => {
                    let onEachFrame = this.assignOnEachFrame();
                    onEachFrame(() => this._stage.executeMain(this._canvas.current));
                    this.setState({
                        playReady: true,
                        playError: false
                    });
                },
                data => this.setState({ playReady: false, playError: data.err })
            );
        }
    };

    assignOnEachFrame = () => {
        if (window.requestAnimationFrame) {
            console.log('Using requestAnimationFrame');
            return (cb) => {
                var _cb = () => {
                    cb();
                    this._requestId = window.requestAnimationFrame(_cb);
                };
                _cb();
            };
        }
        console.log('Using setInterval');
        return (cb) => {
            this._intervalId = setInterval(cb, 1000 / fps);
        }
    };

    keyDown = evt => {
        evt.preventDefault();
        this._stage.keyDown(evt.keyCode);
    };

    keyUp = evt => {
        evt.preventDefault();
        this._stage.keyUp(evt.keyCode);
    };

    modalBody = () => {
        const {rpgMap, playError, playReady, modeVal } = this.state;
        if (!rpgMap) {
            return <Modal.Body />;
        }
        let showError = playError && playError.length > 0;
        return (
            <Modal.Body>
                <Collapse in={showError}>
                    <div>
                        <Alert bsStyle="danger">Could not initiate play mode: {playError}</Alert>
                    </div>
                </Collapse>
                <Collapse in={playReady}>
                    <div>
                        <canvas className="play-canvas" width={viewWidth} height={viewHeight}
                            ref={this._canvas} />
                    </div>
                </Collapse>
                <ButtonToolbar className="play-buttons">
                    <ToggleButtonGroup type="radio"
                                       name="options"
                                       value={modeVal}
                                       onChange={this.handleModeChange}
                                       justified>
                        <ToggleButton type="radio" value={'live'}>Live Mode</ToggleButton>
                        <ToggleButton type="radio" value={'test'}>Test Mode</ToggleButton>
                    </ToggleButtonGroup>
                </ButtonToolbar>
            </Modal.Body>
        );
    };

    render = () => {
        return (
            <Modal show={true} onHide={this.closeModal} dialogClassName="play-map-modal" onKeyDown={this.keyDown} onKeyUp={this.keyUp}>
                <Modal.Header closeButton>
                    <Modal.Title>Play Map</Modal.Title>
                </Modal.Header>
                {this.modalBody(this.props)}
            </Modal>
        );
    };
}
