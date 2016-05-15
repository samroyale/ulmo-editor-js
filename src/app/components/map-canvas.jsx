var React = require('react'),
    ReactDOM = require('react-dom'),
    Bootstrap = require('react-bootstrap'),
    RpgMaps = require('./rpg-maps.js'),
    tilePositionMixin = require('./tile-position-mixin.js'),
    tileSize = require('../config.js').tileSize,
    getDrawingContext = require('../utils.js').getScalableDrawingContext;

var Modal = Bootstrap.Modal,
    ButtonToolbar = Bootstrap.ButtonToolbar,
    ButtonGroup = Bootstrap.ButtonGroup,
    Button = Bootstrap.Button,
    Input = Bootstrap.Input,
    ButtonInput = Bootstrap.ButtonInput,
    Collapse = Bootstrap.Collapse,
    Overlay = Bootstrap.Overlay,
    Popover = Bootstrap.Popover,
    Alert = Bootstrap.Alert,
    Glyphicon = Bootstrap.Glyphicon,
    DropdownButton = Bootstrap.DropdownButton,
    ListGroup = Bootstrap.ListGroup,
    ListGroupItem = Bootstrap.ListGroupItem,
    Grid = Bootstrap.Grid,
    Row = Bootstrap.Row,
    Col = Bootstrap.Col,
    Panel = Bootstrap.Panel;

var RpgMapService = RpgMaps.RpgMapService,
    MaskTile = RpgMaps.MaskTile;

/* =============================================================================
 * COMPONENT: MAP CANVAS
 * =============================================================================
 */
const MapCanvas = React.createClass({
  mixins: [tilePositionMixin],

  _rpgMap: null,
  _canvas: null,
  _highlight: null,

  _mouseDown: null,

  getInitialState: function() {
    return {
      showMap: false,
      showOverlay: false,
      overlayPosition: {x: 0, y: 0},
      showModal: false,
      editableTile: null
    };
  },

  loadMap: function(mapId, callback) {
    var rpgMapService = new RpgMapService();
    rpgMapService.loadMap(mapId, data => {
      this.mapLoaded(data, callback);
    });
  },

  newMap: function(rows, cols, callback) {
    var rpgMapService = new RpgMapService();
    rpgMapService.newMap(rows, cols, data => {
      this.mapLoaded(data, callback);
    });
  },

  mapLoaded: function(data, callback) {
    if (data.map) {
      this._rpgMap = data.map;
      this.drawMap();
      this.setState({ showMap: true });
    }
    callback(data);
  },

  saveMap: function(callback) {
    if (this._rpgMap) {
      var mapService = new RpgMapService();
      mapService.saveMap(this._rpgMap, callback);
    }
  },

  saveMapAs: function(mapName, callback) {
    if (this._rpgMap) {
      var rpgMapService = new RpgMapService();
      rpgMapService.saveMapAs(this._rpgMap, mapName, callback);
    }
  },

  drawMap: function() {
    var cols = this._rpgMap.getCols();
    var rows = this._rpgMap.getRows();
    this._canvas.width = cols * tileSize;
    this._canvas.height = rows * tileSize;
    var ctx = this._canvas.getContext('2d');
    for (var x = 0; x < cols; x++) {
      for (var y = 0; y < rows; y++) {
        ctx.putImageData(this._rpgMap.getMapTile(x, y).getImage(), x * tileSize, y * tileSize)
      }
    }
  },

  unhighlightTile: function(tilePosition) {
    if (!tilePosition) {
      return;
    }
    this._canvas.getContext('2d').putImageData(
      this._rpgMap.getMapTile(tilePosition.x, tilePosition.y).getImage(),
      tilePosition.x * tileSize,
      tilePosition.y * tileSize
    );
  },

  highlightTile: function(tilePosition) {
    if (!tilePosition) {
      return;
    }
    this._canvas.getContext('2d').drawImage(
      this._highlight,
      tilePosition.x * tileSize,
      tilePosition.y * tileSize
    );
  },

  highlightRange: function(fromPosition, toPosition) {
    this.processRange(fromPosition, toPosition, (x, y, cols, rows, ctx) => {
      var highlight = this.initHighlight(rows, cols);
      ctx.drawImage(highlight, x * tileSize, y * tileSize);
    });
  },

  unhighlightRange: function(fromPosition, toPosition) {
    this.processRange(fromPosition, toPosition, (x, y, cols, rows, ctx) => {
      for (var i = x; i < x + cols; i++) {
        for (var j = y; j < y + rows; j++) {
          var mapTile = this._rpgMap.getMapTile(i, j);
          ctx.putImageData(mapTile.getImage(), i * tileSize, j * tileSize);
        }
      }
    });
  },

  /*highlightedTiles() {
    if (!this.state.showModal) {
      return [];
    }
    var highlightedTiles = [];
    var toPosition = this.props.tilePosition;
    var fromPosition = this.state.startPosition ? this.state.startPosition : toPosition;
    this.processRange(fromPosition, toPosition, (x, y, cols, rows, ctx) => {
      for (var i = x; i < x + cols; i++) {
        for (var j = y; j < y + rows; j++) {
          highlightedTiles.push(this._rpgMap.getMapTile(i, j));
        }
      }
    });
    return highlightedTiles;
  },*/

  applySelectedTile: function(fromPosition, toPosition) {
    this.processHighlightedTiles(mapTile => {
      mapTile.addMaskTile(new MaskTile(this.props.selectedTile));
    });
    this.forceUpdate();
  },

  sendToBack: function() {
    this.processHighlightedTiles(mapTile => {
      mapTile.sendToBack();
    });
    this.hideOverlay();
  },

  keepTop: function() {
    this.processHighlightedTiles(mapTile => {
      mapTile.keepTop();
    });
    this.hideOverlay();
  },

  clear: function() {
    this.processHighlightedTiles(mapTile => {
      mapTile.clear();
    });
    this.hideOverlay();
  },

  editTile: function() {
    var mapTile = this._rpgMap.getMapTile(this.props.tilePosition.x, this.props.tilePosition.y);
    this.setState({
      showOverlay: false,
      showModal: true,
      editableTile: mapTile.copy()
    });
  },

  applyTileEdit: function() {
    this._rpgMap.putMapTile(
      this.props.tilePosition.x,
      this.props.tilePosition.y,
      this.state.editableTile
    );
    this.processHighlightedTiles(mapTile => {
      mapTile.initImageData();
    });
    this.closeModal();
  },

  processHighlightedTiles: function(func) {
    var toPosition = this.props.tilePosition;
    var fromPosition = this.state.startPosition ? this.state.startPosition : toPosition;
    this.processRange(
      fromPosition,
      toPosition,
      (x, y, cols, rows, ctx) => {
        for (var i = x; i < x + cols; i++) {
          for (var j = y; j < y + rows; j++) {
            var mapTile = this._rpgMap.getMapTile(i, j);
            func(mapTile);
            ctx.putImageData(mapTile.getImage(), i * tileSize, j * tileSize);
          }
        }
      }
    );
  },

  processRange: function(fromPosition, toPosition, func) {
    if (!toPosition) {
      return;
    }
    var x = Math.min(fromPosition.x, toPosition.x);
    var y = Math.min(fromPosition.y, toPosition.y);
    var cols = Math.abs(fromPosition.x - toPosition.x) + 1;
    var rows = Math.abs(fromPosition.y - toPosition.y) + 1;
    var ctx = this._canvas.getContext('2d');
    func(x, y, cols, rows, ctx);
  },

  buttonsMetadata: function() {
    if (!this.state.showOverlay) {
      return [];
    }
    return [
      {label: 'Send to back', onClick: this.sendToBack},
      {label: 'Keep top', onClick: this.keepTop},
      {label: 'Clear', onClick: this.clear},
      {label: 'Edit', onClick: this.editTile},
      {label: 'Sorry', disabled: true, onClick: null}
    ];
  },

  handleMouseMove: function(evt) {
    if (this.state.showOverlay) {
      return;
    }
    var tilePosition = this.getCurrentTilePosition(evt);
    if (this.props.tilePosition &&
        tilePosition.x == this.props.tilePosition.x &&
        tilePosition.y == this.props.tilePosition.y) {
      return;
    }
    if (this.state.startPosition && !this._mouseDown) {
      this.setState({ startPosition: null });
    }
    var tile = this._rpgMap.getMapTile(tilePosition.x, tilePosition.y);
    this.props.onTilePositionUpdated(tilePosition, tile);
  },

  handleMouseOut: function() {
    if (this.state.showOverlay) {
      return;
    }
    this._mouseDown = false;
    this.setState({ startPosition: null });
    this.props.onTilePositionUpdated();
  },

  handleRightClick: function(evt) {
    evt.preventDefault();
    var showOverlay = !this.state.showOverlay;
    if (!showOverlay) {
      this.setState({ showOverlay });
      return;
    }
    var overlayPosition = this.getOverlayPosition(evt);
    this.setState({ showOverlay, overlayPosition });
  },

  handleMouseDown: function(evt) {
    if (this.state.showOverlay) {
      return;
    }
    if (evt.button !== 0) {
      return;
    }
    this._mouseDown = true;
    var tilePosition = this.getCurrentTilePosition(evt);
    this.setState({ startPosition: tilePosition});
    var tile = this._rpgMap.getMapTile(tilePosition.x, tilePosition.y);
    this.props.onTilePositionUpdated(tilePosition, tile);
  },

  handleMouseUp: function(evt) {
    if (evt.button !== 0) {
      return;
    }
    this._mouseDown = false;
    if (!this.props.selectedTile) {
      return;
    }
    this.applySelectedTile(this.state.startPosition, this.props.tilePosition);
  },

  componentDidMount: function() {
    this._highlight = this.initTileHighlight();
  },

  componentDidUpdate: function(oldProps, oldState) {
    if (oldState.startPosition) {
      this.unhighlightRange(oldState.startPosition, oldProps.tilePosition);
      if (this.state.startPosition) {
        this.highlightRange(this.state.startPosition, this.props.tilePosition);
        return;
      }
    }
    this.unhighlightTile(oldProps.tilePosition);
    this.highlightTile(this.props.tilePosition);
  },

  hideOverlay: function() {
    this.setState({ showOverlay: false });
  },

  closeModal: function() {
    this.setState({
      showModal: false,
      editableTile: null
    });
  },

  render: function() {
    var bsClass = this.state.showMap ? "show" : "hidden";
    return (
      <div className="canvas-container">
        <canvas className={bsClass}
            onMouseMove={this.handleMouseMove}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseOut={this.handleMouseOut}
            onContextMenu={this.handleRightClick}
            ref={cvs => this._canvas = cvs} />

        <MapCanvasPopup
            showOverlay={this.state.showOverlay}
            position={this.state.overlayPosition}
            buttons={this.buttonsMetadata()}
            onHide={this.hideOverlay} />

        <EditTilesModal
            showModal={this.state.showModal}
            editableTile={this.state.editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyTileEdit} />
      </div>
    );
  }
});

/* =============================================================================
 * COMPONENT: MAP CANVAS POPUP
 * =============================================================================
 */
const MapCanvasPopup = React.createClass({
  suppress: function(evt) {
    evt.preventDefault();
  },

  render: function() {
    var style = {
      marginLeft: this.props.position.x,
      marginTop: this.props.position.y
    };
    var buttons = this.props.buttons.map(
      button => <Button key={button.label} disabled={button.disabled}
          onClick={button.onClick}>{button.label}</Button>
    );
    return (
      <Overlay
        show={this.props.showOverlay}
        rootClose={true}
        onHide={this.props.onHide}>
        <div className="map-overlay" style={style} onContextMenu={this.suppress}>
          <ButtonGroup vertical>{buttons}</ButtonGroup>
        </div>
      </Overlay>
    );
  }
});

/* =============================================================================
 * COMPONENT: EDIT TILES MODAL
 * =============================================================================
 */
const EditTilesModal = React.createClass({

  _tileCanvas: null,

  moveTile: function(evt, func) {
    var buttonId = evt.currentTarget.id;
    var maskTiles = this.props.editableTile.getMaskTiles();
    var index = maskTiles.length - parseInt(buttonId.slice(3), 10) - 1;
    var maskTile = maskTiles[index];
    func(maskTiles, maskTile, index);
    this.forceUpdate();
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

  componentDidUpdate: function(oldProps, oldState) {
    if (!this.props.editableTile) {
      return;
    }
    var maskTiles = this.props.editableTile.getMaskTiles();
    maskTiles.forEach((maskTile, i) => {
      var index = maskTiles.length - i - 1;
      var item = this.refs["item" + index];
      item.drawToCanvas(maskTile);
    });
    var ctx = getDrawingContext(this._tileCanvas);
    ctx.clearRect(0, 0, this._tileCanvas.width, this._tileCanvas.height);
    ctx.drawImage(this.props.editableTile.getCanvas(), 0, 0, this._tileCanvas.width, this._tileCanvas.height);
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
    if (!this.props.editableTile) {
      return <ListGroup />;
    }
    var maskTiles = this.props.editableTile.getMaskTiles();
    if (maskTiles.length === 0) {
      return <ListGroup />;
    }
    var tileItems = maskTiles.map((maskTile, i) => {
      var tilePosition = this.tilePosition(i, maskTiles.length - 1);
      return (
        <TileListItem key={i}
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
    return (<ListGroup className="edit-tiles-section">{tileItems}</ListGroup>);
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose} bsSize="medium">
        <Modal.Header closeButton>
          <Modal.Title>Edit Tiles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid>
            <Row>
              <Col className="edit-tiles-col" lg={4}>{this.tileListGroup()}</Col>
              <Col className="edit-tiles-col" lg={2}>
                <Panel className="tile-preview-panel">
                  <canvas className="tiles tile-preview" width={tileSize * 2} height={tileSize * 2}
                      ref={cvs => this._tileCanvas = cvs} />
                </Panel>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>Cancel</Button>
          <Button onClick={this.props.onSubmit} bsStyle="primary">OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: TILE LIST ITEM
 * =============================================================================
 */
const TileListItem = React.createClass({

  _canvas: null,

  drawToCanvas: function(maskTile) {
    var ctx = getDrawingContext(this._canvas);
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
              <ButtonToolbar className="tile-buttons">
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
              <ButtonToolbar className="tile-buttons">
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

module.exports = MapCanvas;