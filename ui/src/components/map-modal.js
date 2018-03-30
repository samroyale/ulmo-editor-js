import React from 'react';
import { Modal, Grid, Row, Col, Panel, ListGroup, ListGroupItem, ButtonToolbar,
    ButtonGroup, Button, Glyphicon, FormGroup, FormControl,
    Checkbox, Well } from 'react-bootstrap';
import { tileSize } from '../config';
import { getDrawingContext, drawTile, parseLevel } from '../utils';
import './map-modal.css';

// allows 'specials' eg. S1.5, S2 and 'drops' eg. D3-2
const levelRegex = /[^\dSD.-]/g;

const numRegex = /\D/g;

/* =============================================================================
 * COMPONENT: EDIT LEVELS MODAL
 * =============================================================================
 */
export const EditLevelsModal = React.createClass({

  getInitialState: function() {
    return {
      levelVal: '',
      levels: [],
      selectedIndices: [],
      addDisabled: true,
      deleteDisabled: true
    };
  },

  handleSubmit: function() {
    this.props.onSubmit(this.state.levels);
  },

  handleLevelChange: function(event) {
    this.setLevelVal(event.target.value.replace(levelRegex, ''));
  },

  setLevelVal: function(newLevelVal) {
    var levelValid = this.isLevelValid(newLevelVal);
    this.setState({
      levelVal: newLevelVal,
      addDisabled: !levelValid
    });
  },

  isLevelValid: function(levelVal) {
    try {
      parseLevel(levelVal);
      return true;
    }
    catch (e) {
      // console.log(e.message);
    }
    return false;
  },

  addLevel: function() {
    try {
      let level = this.normalizeLevel(this.state.levelVal)
      if (this.state.levels.includes(level)) {
        return;
      }
      this.setState({
        levelVal: "",
        levels: [...this.state.levels, level],
        addDisabled: true
      });
    }
    catch (e) {
      console.log(e.name + ": " + e.message);
    }
  },

  normalizeLevel(levelStr) {
    let result = parseLevel(levelStr);
    if (result.type === 'special') {
      return 'S' + result.level;
    }
    if (result.type === 'down') {
      return 'D' + result.level + '-' + result.drop;
    }
    return '' + result.level;
  },

  delete: function(evt) {
    var buttonId = evt.currentTarget.id;
    var index = parseInt(buttonId.slice(3), 10);
    var newLevels = this.state.levels.slice();
    newLevels.splice(index, 1);
    this.setState({
      levelVal: "",
      levels: newLevels
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
      var initialState = this.getInitialState();
      initialState.levels = this.getLevels(props);
      this.setState(initialState);
    }
  },

  getLevels: function(props) {
    if (!props.editableTile) {
      return [];
    }
    // return a copy of the levels array
    return props.editableTile.getLevels().slice();
  },

  levels: function() {
    return this.state.levels.map((level, i) => {
      return (
        <LevelItem
            key={i}
            buttonId={'btn' + i}
            level={level}
            onDelete={this.delete} />
      );
    })
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose} dialogClassName="tile-levels-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Panel className="edit-levels-panel" header="Levels">
            <ListGroup fill>
              {this.levels()}
              <ListGroupItem>
                <Grid>
                  <Row>
                    <Col className="edit-level-col" lg={1}>
                      <FormControl type="text"
                                   placeholder="level"
                                   value={this.state.levelVal}
                                   onChange={this.handleLevelChange} />
                    </Col>
                    <Col className="edit-tiles-col" lg={1}>
                      <ButtonToolbar className="sprite-controls">
                        <Button onClick={this.addLevel} disabled={this.state.addDisabled}>
                          <Glyphicon glyph="plus" />
                        </Button>
                      </ButtonToolbar>
                    </Col>
                  </Row>
                </Grid>
              </ListGroupItem>
            </ListGroup>
          </Panel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit} bsStyle="primary">OK</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: LEVEL ITEM
 * =============================================================================
 */
function LevelItem(props) {
  return (
    <ListGroupItem>
      <Grid>
        <Row>
          <Col className="edit-level-col" lg={1}>
            <Well className="level-well" bsSize="small">level: {props.level}</Well>
          </Col>
          <Col className="edit-tiles-col" lg={1}>
            <ButtonToolbar className="sprite-controls">
              <Button id={props.buttonId} onClick={props.onDelete}>
                <Glyphicon glyph="trash" />
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
      </Grid>
    </ListGroupItem>
  );
}

/* =============================================================================
 * COMPONENT: EDIT IMAGES MODAL
 * =============================================================================
 */
export const EditImagesModal = React.createClass({
  _previewCanvas: null,

  getInitialState: function() {
    return {
      maskTiles: [],
    };
  },

  handleSubmit: function() {
    this.props.onSubmit(this.state.maskTiles);
  },

  moveTile: function(evt, func) {
    var buttonId = evt.currentTarget.id;
    var newMaskTiles = this.state.maskTiles.slice();
    var index = newMaskTiles.length - parseInt(buttonId.slice(3), 10) - 1;
    var maskTile = newMaskTiles[index];
    func(newMaskTiles, maskTile, index);
    this.setState({ maskTiles: newMaskTiles });
  },

  moveTop: function(evt) {
    this.moveTile(evt, (maskTiles, maskTile, index) => {
      if (index < maskTiles.length - 1) {
        maskTiles.splice(index, 1);
        maskTiles.push(maskTile);
      }
    });
  },

  moveUp: function(evt) {
    this.moveTile(evt, (maskTiles, maskTile, index) => {
      if (index < maskTiles.length - 1) {
        maskTiles.splice(index, 1);
        maskTiles.splice(index + 1, 0, maskTile);
      }
    });
  },

  moveDown: function(evt) {
    this.moveTile(evt, (maskTiles, maskTile, index) => {
      if (index > 0) {
        maskTiles.splice(index, 1);
        maskTiles.splice(index - 1, 0, maskTile);
      }
    });
  },

  moveBottom: function(evt) {
    this.moveTile(evt, (maskTiles, maskTile, index) => {
      if (index > 0) {
        maskTiles.splice(index, 1);
        maskTiles.splice(0, 0, maskTile);
      }
    });
  },

  delete: function(evt) {
    this.moveTile(evt, (maskTiles, maskTile, index) => {
      maskTiles.splice(index, 1);
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
      this.setState({ maskTiles: this.getMaskTiles(props) });
    }
  },

  getMaskTiles: function(props) {
    if (!props.editableTile) {
      return [];
    }
    // return a copy of the mask tiles array
    return props.editableTile.getMaskTiles();
  },

  componentDidUpdate: function(oldProps, oldState) {
    var maskTiles = this.state.maskTiles.slice().reverse(); // copy + reverse the array
    maskTiles.forEach((maskTile, i) => {
      var item = this.refs['item' + i];
      if (item) {
        item.drawToCanvas(maskTile);
      }
    });
    if (this._previewCanvas) {
      var ctx = getDrawingContext(this._previewCanvas);
      ctx.clearRect(0, 0, this._previewCanvas.width, this._previewCanvas.height);
      ctx.drawImage(drawTile(this.state.maskTiles), 0, 0,
          this._previewCanvas.width, this._previewCanvas.height);
    }
  },

  listPosition: function(tileIndex, lastIndex) {
    var position = [];
    if (tileIndex === 0) {
      position.push('first');
    }
    if (tileIndex === lastIndex) {
      position.push('last');
    }
    return position;
  },

  tileItems: function() {
    return this.state.maskTiles.map((maskTile, i) => {
      var listPosition = this.listPosition(i, this.state.maskTiles.length - 1);
      return (
        <TileImageItem key={i}
          ref={'item' + i}
          buttonId={'btn' + i}
          position={listPosition}
          onMoveTop={this.moveTop}
          onMoveUp={this.moveUp}
          onMoveDown={this.moveDown}
          onMoveBottom={this.moveBottom}
          onDelete={this.delete} />
      );
    });
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose} dialogClassName="tile-images-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid>
            <Row>
              <Col className="tile-images-col" lg={4}>
                <Panel className="tile-images-panel" header="Images">
                  <ListGroup fill>{this.tileItems()}</ListGroup>
                </Panel>
              </Col>
              <Col className="edit-tiles-col" lg={2}>
                <Panel className="tile-preview-panel" header="Preview">
                  <ListGroup fill>
                    <ListGroupItem className="tile-list-item">
                      <canvas className="tile-preview" width={tileSize * 2} height={tileSize * 2}
                              ref={cvs => this._previewCanvas = cvs} />
                    </ListGroupItem>
                  </ListGroup>
                </Panel>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit} bsStyle="primary">OK</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: TILE IMAGE ITEM
 * =============================================================================
 */
const TileImageItem = React.createClass({
  _canvas: null,

  drawToCanvas: function(maskTile) {
    var ctx = getDrawingContext(this._canvas);
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    ctx.drawImage(maskTile.getTile().getCanvas(), 0, 0, this._canvas.width, this._canvas.height);
  },

  render: function() {
    var disabledFirst = this.props.position.includes('first');
    var disabledLast = this.props.position.includes('last');
    return (
      <ListGroupItem className="tile-list-item">
        <Grid>
          <Row>
            <Col className="tile-canvas-col" lg={1}>
              <div className="tile-canvas-container">
                <canvas className="tiles" width={tileSize * 2} height={tileSize * 2}
                    ref={cvs => this._canvas = cvs} />
              </div>
            </Col>
            <Col className="tile-controls-col" lg={2}>
              <ButtonToolbar className="tile-controls">
                <ButtonGroup>
                  <Button id={this.props.buttonId} onClick={this.props.onMoveTop} disabled={disabledFirst}>
                    <Glyphicon glyph="triangle-top" />
                  </Button>
                  <Button id={this.props.buttonId} onClick={this.props.onMoveUp} disabled={disabledFirst}>
                    <Glyphicon glyph="menu-up" />
                  </Button>
                  <Button id={this.props.buttonId} onClick={this.props.onMoveDown} disabled={disabledLast}>
                    <Glyphicon glyph="menu-down" />
                  </Button>
                  <Button id={this.props.buttonId} onClick={this.props.onMoveBottom} disabled={disabledLast}>
                    <Glyphicon glyph="triangle-bottom" />
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
            <Col className="edit-tiles-item-col" lg={1}>
              <ButtonToolbar className="tile-controls">
                <Button id={this.props.buttonId} onClick={this.props.onDelete}>
                  <Glyphicon glyph="trash" />
                </Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </Grid>
      </ListGroupItem>
    );
  }
});

/* =============================================================================
 * COMPONENT: EDIT MASKS MODAL
 * =============================================================================
 */
export const EditMasksModal = React.createClass({
  getInitialState: function() {
    return {
      maskTiles: []
    };
  },

  handleSubmit: function() {
    this.state.maskTiles.forEach((maskTile, i) => {
      var item = this.refs['item' + i];
      maskTile.setMaskLevel(this.getMaskLevel(item));
    });
    this.props.onSubmit(this.state.maskTiles.reverse());
  },

  getMaskLevel: function(tileMaskItem) {
    var maskLevel = parseInt(tileMaskItem.state.levelVal, 10);
    if (!maskLevel) {
      return null;
    }
    if (tileMaskItem.state.verticalVal) {
      return 'V' + maskLevel;
    }
    return maskLevel.toString();
  },

  componentWillMount: function() {
    this.populateStateFromProps(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    this.populateStateFromProps(nextProps);
  },

  populateStateFromProps: function(props) {
    if (props.showModal) {
      this.setState({ maskTiles: this.getMaskTiles(props) });
    }
  },

  getMaskTiles: function(props) {
    if (!props.editableTile) {
      return [];
    }
    // return a reversed copy of the mask tiles array
    return props.editableTile.getMaskTiles().reverse();
  },

  componentDidUpdate: function(oldProps, oldState) {
    this.state.maskTiles.forEach((maskTile, i) => {
      var item = this.refs['item' + i];
      if (item) {
        item.drawToCanvas(maskTile);
      }
    });
  },

  tileItems: function() {
    return this.state.maskTiles.map((maskTile, i) => {
      var maskLevel = maskTile.getMaskLevel();
      var maskVertical = false;
      if (maskLevel) {
        if (maskLevel.startsWith('V')) {
          maskVertical = true;
          maskLevel = maskLevel.substr(1);
        }
      }
      else {
        maskLevel = '';
      }
      return (
        <TileMaskItem key={i} index={i} ref={'item' + i} level={maskLevel} vertical={maskVertical} />
      );
    });
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose} dialogClassName="tile-masks-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Panel className="tile-masks-panel" header="Masks">
            <ListGroup fill>{this.tileItems()}</ListGroup>
          </Panel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit} bsStyle="primary">OK</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: TILE MASK ITEM
 * =============================================================================
 */
const TileMaskItem = React.createClass({
  _canvas: null,

  getInitialState: function() {
    return {
      levelVal: '',
      verticalVal: false
    };
  },

  handleLevelChange: function(event) {
    this.setState({ levelVal: event.target.value.replace(numRegex, '') });
  },

  handleVerticalChange: function(event) {
    this.setState({ verticalVal: event.target.checked });
  },

  drawToCanvas: function(maskTile) {
    var ctx = getDrawingContext(this._canvas);
    ctx.drawImage(maskTile.getTile().getCanvas(), 0, 0, this._canvas.width, this._canvas.height);
  },

  componentWillMount: function() {
    this.populateStateFromProps(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    this.populateStateFromProps(nextProps);
  },

  populateStateFromProps: function(props) {
    this.setState({
      levelVal: props.level,
      verticalVal: props.vertical
    });
  },

  render: function() {
    return (
      <ListGroupItem className="tile-list-item">
        <Grid>
          <Row>
            <Col className="tile-canvas-col" lg={1}>
              <div className="tile-canvas-container">
                <canvas className="tiles" width={tileSize * 2} height={tileSize * 2}
                    ref={cvs => this._canvas = cvs} />
              </div>
            </Col>
            <Col className="edit-tiles-item-col" lg={1}>
              <div className="tile-controls">
                <FormGroup controlId={"levelGroup" + this.props.index}>
                  <FormControl type="text" placeholder="level"
                      value={this.state.levelVal} onChange={this.handleLevelChange} />
                </FormGroup>
              </div>
            </Col>
            <Col className="edit-tiles-item-col" lg={1}>
              <div className="tile-checkbox">
                <FormGroup controlId={"verticalGroup" + this.props.index}>
                  <Checkbox checked={this.state.verticalVal} onChange={this.handleVerticalChange}>
                    Vertical
                  </Checkbox>
                </FormGroup>
              </div>
            </Col>
          </Row>
        </Grid>
      </ListGroupItem>
    );
  }
});
