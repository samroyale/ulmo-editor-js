var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    utils = require('../utils.js'),
    tileSize = require('../config.js').tileSize;

var Modal = Bootstrap.Modal,
    Grid = Bootstrap.Grid,
    Row = Bootstrap.Row,
    Col = Bootstrap.Col,
    Panel = Bootstrap.Panel,
    ListGroup = Bootstrap.ListGroup,
    ListGroupItem = Bootstrap.ListGroupItem,
    ButtonToolbar = Bootstrap.ButtonToolbar,
    ButtonGroup = Bootstrap.ButtonGroup,
    Button = Bootstrap.Button,
    Glyphicon = Bootstrap.Glyphicon,
    FormGroup = Bootstrap.FormGroup,
    InputGroup = Bootstrap.InputGroup,
    ControlLabel = Bootstrap.ControlLabel,
    FormControl = Bootstrap.FormControl,
    Checkbox = Bootstrap.Checkbox;

/* =============================================================================
 * COMPONENT: EDIT LEVELS MODAL
 * =============================================================================
 */
const EditLevelsModal = React.createClass({
  _regex: /\D/g,

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
    this.setLevelVal(event.target.value.replace(this._regex, ''));
  },

  setLevelVal: function(newLevelVal) {
    var levelValid = this.isLevelValid(newLevelVal);
    this.setState({
      levelVal: newLevelVal,
      addDisabled: !levelValid
    });
  },

  isLevelValid: function(levelVal) {
    if (levelVal.length === 0) {
      return false;
    }
    return true;
  },

  handleLevelsChange: function(event) {
    var indices = [];
    var selected = event.target.selectedOptions;
    for (i = 0; i < selected.length; i++) {
      indices.push(selected.item(i).index);
    }
    this.setState({
      selectedIndices: indices,
      deleteDisabled: indices.length === 0
    });
  },

  addLevel: function() {
    if (this.state.levels.includes(this.state.levelVal)) {
      return;
    }
    var newLevels = this.state.levels.slice(0);
    newLevels.push(this.state.levelVal);
    this.setState({
      levelVal: "",
      levels: newLevels
    });
  },

  deleteLevels: function() {
    var newLevels = this.state.levels.filter((level, i) => {
      return !this.state.selectedIndices.includes(i);
    });
    this.setState({ levels: newLevels });
  },

  clearLevels: function() {
    this.setState({ levels: [] });
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
    return props.editableTile.getLevels().slice(0);
  },

  levelsControl: function() {
    var levelOptions = this.state.levels.map((level, i) => {
      var selected = this.state.selectedIndices.includes(i);
      return (<option key={i} value={level}>{level}</option>);
    });
    var selectedLevels = this.state.levels.filter((level, i) => {
      return this.state.selectedIndices.includes(i);
    });
    return (
      <FormControl componentClass="select" onChange={this.handleLevelsChange} value={selectedLevels} multiple>
        {levelOptions}
      </FormControl>
    );
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <Grid>
              <Row>
                <Col className="edit-tiles-col" lg={3}>
                  <FormGroup controlId="levelGroup">
                    <ControlLabel>New level</ControlLabel>
                    <FormControl type="text" placeholder="level"
                        value={this.state.levelVal} onChange={this.handleLevelChange} />
                  </FormGroup>
                </Col>
                <Col className="edit-tiles-col" lg={1}>
                  <FormGroup controlId="addGroup">
                    <ControlLabel>&nbsp;</ControlLabel>
                    <ButtonToolbar>
                      <Button className="with-bottom-margin" disabled={this.state.addDisabled}
                          onClick={this.addLevel} block>Add</Button>
                    </ButtonToolbar>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="edit-tiles-col" lg={3}>
                  <FormGroup controlId="levelsGroup">
                    <ControlLabel>Levels</ControlLabel>
                    {this.levelsControl()}
                  </FormGroup>
                </Col>
                <Col className="edit-tiles-col" lg={1}>
                  <FormGroup controlId="controlsGroup">
                    <ControlLabel>&nbsp;</ControlLabel>
                    <ButtonToolbar>
                      <Button className="with-bottom-margin" disabled={this.state.deleteDisabled}
                          onClick={this.deleteLevels} block>Delete</Button>
                    </ButtonToolbar>
                    <ButtonToolbar>
                      <Button className="with-bottom-margin" onClick={this.clearLevels} block>Clear</Button>
                    </ButtonToolbar>
                  </FormGroup>
                </Col>
              </Row>
            </Grid>
          </form>
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
 * COMPONENT: EDIT IMAGES MODAL
 * =============================================================================
 */
const EditImagesModal = React.createClass({
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
    var newMaskTiles = this.state.maskTiles.slice(0);
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
    return props.editableTile.getMaskTiles().slice(0);
  },

  componentDidUpdate: function(oldProps, oldState) {
    var maskTiles = this.state.maskTiles.slice(0).reverse(); // copy + reverse the array
    maskTiles.forEach((maskTile, i) => {
      var item = this.refs["item" + i];
      if (item) {
        item.drawToCanvas(maskTile);
      }
    });
    if (this._previewCanvas) {
      var ctx = utils.getScalableDrawingContext(this._previewCanvas);
      ctx.clearRect(0, 0, this._previewCanvas.width, this._previewCanvas.height);
      ctx.drawImage(utils.drawTile(this.state.maskTiles), 0, 0,
          this._previewCanvas.width, this._previewCanvas.height);
    }
  },

  tilePosition: function(tileIndex, lastIndex) {
    var position = [];
    if (tileIndex === 0) {
      position.push("first")
    }
    if (tileIndex === lastIndex) {
      position.push("last")
    }
    return position;
  },

  tileListGroup: function() {
    var tileItems = this.state.maskTiles.map((maskTile, i) => {
      var tilePosition = this.tilePosition(i, this.state.maskTiles.length - 1);
      return (
        <TileImageItem key={i}
          ref={"item" + i}
          buttonId={"btn" + i}
          position={tilePosition}
          onMoveTop={this.moveTop}
          onMoveUp={this.moveUp}
          onMoveDown={this.moveDown}
          onMoveBottom={this.moveBottom}
          onDelete={this.delete} />
      );
    });
    return (<ListGroup fill>{tileItems}</ListGroup>);
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid>
            <Row>
              <Col className="edit-tiles-col" lg={4}>
                <Panel className="tile-images-panel" header="Images">
                  {this.tileListGroup()}
                </Panel>
              </Col>
              <Col className="edit-tiles-col" lg={2}>
                <Panel className="tile-preview-panel" header="Preview">
                  <canvas className="tiles tile-preview" width={tileSize * 2} height={tileSize * 2}
                      ref={cvs => this._previewCanvas = cvs} />
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
    var ctx = utils.getScalableDrawingContext(this._canvas);
    ctx.drawImage(maskTile.getTile().getCanvas(), 0, 0, this._canvas.width, this._canvas.height);
  },

  render: function() {
    var disabledFirst = this.props.position.includes("first");
    var disabledLast = this.props.position.includes("last");
    return (
      <ListGroupItem>
        <Grid>
          <Row>
            <Col className="edit-tiles-item-col" lg={1}>
              <div className="tile-canvas-container">
                <canvas className="tiles" width={tileSize * 2} height={tileSize * 2}
                    ref={cvs => this._canvas = cvs} />
              </div>
            </Col>
            <Col className="edit-tiles-item-col" lg={2}>
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
const EditMasksModal = React.createClass({
  getInitialState: function() {
    return {
      maskTiles: []
    };
  },

  handleSubmit: function() {
    this.state.maskTiles.forEach((maskTile, i) => {
      var item = this.refs["item" + i];
      maskTile.setMaskLevel(this.getMaskLevel(item));
    });
    this.props.onSubmit(this.state.maskTiles);
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
    return props.editableTile.getMaskTiles().slice(0).reverse();
  },

  componentDidUpdate: function(oldProps, oldState) {
    this.state.maskTiles.forEach((maskTile, i) => {
      var item = this.refs["item" + i];
      if (item) {
        item.drawToCanvas(maskTile);
      }
    });
  },

  tileListGroup: function() {
    var tileItems = this.state.maskTiles.map((maskTile, i) => {
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
        <TileMaskItem key={i}
          index={i}
          ref={"item" + i}
          level={maskLevel}
          vertical={maskVertical} />
      );
    });
    return (<ListGroup fill>{tileItems}</ListGroup>);
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose} dialogClassName="tile-masks-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid>
            <Row>
              <Col className="edit-tiles-col" lg={5}>
                <form>
                  <Panel className="tile-masks-panel" header="Masks">
                    {this.tileListGroup()}
                  </Panel>
                </form>
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
 * COMPONENT: TILE MASK ITEM
 * =============================================================================
 */
const TileMaskItem = React.createClass({
  _canvas: null,
  _regex: /\D/g,

  getInitialState: function() {
    return {
      levelVal: '',
      verticalVal: false
    };
  },

  handleLevelChange: function(event) {
    this.setState({ levelVal: event.target.value.replace(this._regex, '') });
  },

  handleVerticalChange: function(event) {
    this.setState({ verticalVal: event.target.checked });
  },

  drawToCanvas: function(maskTile) {
    var ctx = utils.getScalableDrawingContext(this._canvas);
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
      <ListGroupItem>
        <Grid>
          <Row>
            <Col className="edit-tiles-item-col" lg={1}>
              <div className="tile-canvas-container">
                <canvas className="tiles" width={tileSize * 2} height={tileSize * 2}
                    ref={cvs => this._canvas = cvs} />
              </div>
            </Col>
            <Col className="edit-tiles-item-col" lg={2}>
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

module.exports = {
  EditLevelsModal,
  EditImagesModal,
  EditMasksModal
};
