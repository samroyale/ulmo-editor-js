var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    RpgMaps = require('./rpg-maps.js'),
    tilePositionMixin = require('./tile-position-mixin.js'),
    tileSize = require('../config.js').tileSize;

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
    ListGroupItem = Bootstrap.ListGroupItem;

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

  highlightRange(fromPosition, toPosition) {
    this.processRange(fromPosition, toPosition, (x, y, cols, rows, ctx) => {
      var highlight = this.initHighlight(rows, cols);
      ctx.drawImage(highlight, x * tileSize, y * tileSize);
    });
  },

  unhighlightRange(fromPosition, toPosition) {
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

  applySelectedTile(fromPosition, toPosition) {
    this.processHighlightedTiles(mapTile => {
      mapTile.addMaskTile(new MaskTile(this.props.selectedTile));
    });
  },

  sendToBack() {
    this.setState({ showOverlay: false });
    this.processHighlightedTiles(mapTile => {
      mapTile.sendToBack();
    });
  },

  keepTop() {
    this.setState({ showOverlay: false });
    this.processHighlightedTiles(mapTile => {
      mapTile.keepTop();
    });
  },

  clear() {
    this.setState({ showOverlay: false });
    this.processHighlightedTiles(mapTile => {
      mapTile.clear();
    });
  },

  edit() {
    var mapTile = this._rpgMap.getMapTile(this.props.tilePosition.x, this.props.tilePosition.y);
    this.setState({
      showModal: true,
      editableTile: mapTile.copy()
    });
  },

  processHighlightedTiles(func) {
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
    this.setState({ updated: Date.now() });
  },

  processRange(fromPosition, toPosition, func) {
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
      {label: 'Edit', onClick: this.edit},
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
    this.setState({ showModal: false });
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
            onClose={this.closeModal} />
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

  _canvasGroup: null,

  getScalableDrawingContext: function(canvas) {
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    return context;
  },

  componentDidUpdate: function(oldProps, oldState) {
    if (this._canvasGroup.length > 0) {
      this._canvasGroup.reverse().forEach((cvs, i) => {
        cvs.width = tileSize * 2;
        cvs.height = tileSize * 2;
        var maskTiles = this.props.editableTile.getMaskTiles();
        var tileImage = maskTiles[i].getTile().getCanvas();
        var ctx = this.getScalableDrawingContext(cvs);
        ctx.drawImage(tileImage, 0, 0, cvs.width, cvs.height);
      });
    }
  },

  tileListGroup: function() {
    this._canvasGroup = [];

    if (!this.props.editableTile) {
      return <ListGroup />;
    }
    var maskTiles = this.props.editableTile.getMaskTiles();
    if (maskTiles.length === 0) {
      return <ListGroup />;
    }
    var tileItems = maskTiles.map((maskTile, i) => {
      return (
        <ListGroupItem key={i}>
          <div className="tile-canvas-container">
            <canvas className="tiles" ref={cvs => this._canvasGroup.push(cvs)} />
          </div>
          <ButtonToolbar>
  <ButtonGroup>
    <Button><Glyphicon glyph="align-left" /></Button>
    <Button><Glyphicon glyph="align-center" /></Button>
    <Button><Glyphicon glyph="align-right" /></Button>
    <Button><Glyphicon glyph="align-justify" /></Button>
  </ButtonGroup>
</ButtonToolbar>

        </ListGroupItem>
      );
    });
    return (<ListGroup>{tileItems}</ListGroup>);
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tiles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.tileListGroup()}
        </Modal.Body>
      </Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: MAP TILE INFO
 * =============================================================================
 */
function MapTileInfo(props) {
  if (props.tilePosition && props.mapTile) {
    var levelsInfo = "[" + props.mapTile.getLevels().toString() + "]";
    return (<p className="no-margin">{props.tilePosition.x}, {props.tilePosition.y} :: {props.mapTile.getMaskTiles().length} {levelsInfo}</p>);
  }
  return (<p className="no-margin">-</p>);
}

module.exports = MapCanvas;
