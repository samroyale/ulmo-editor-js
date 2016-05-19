var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    RpgMaps = require('./rpg-maps.js'),
    MapModal = require('./map-modal.jsx'),
    tilePositionMixin = require('./tile-position-mixin.js'),
    tileSize = require('../config.js').tileSize;

var Overlay = Bootstrap.Overlay,
    ButtonGroup = Bootstrap.ButtonGroup,
    Button = Bootstrap.Button,
    DropdownButton = Bootstrap.DropdownButton;

var RpgMapService = RpgMaps.RpgMapService;

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
      showLevelsModal: false,
      showImagesModal: false,
      showMasksModal: false,
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
      mapTile.addMaskTile(new RpgMaps.MaskTile(this.props.selectedTile));
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

  editLevels: function() {
    var mapTile = this._rpgMap.getMapTile(this.props.tilePosition.x, this.props.tilePosition.y);
    this.setState({
      showOverlay: false,
      showLevelsModal: true,
      editableTile: mapTile.copy()
    });
  },

  editImages: function() {
    var mapTile = this._rpgMap.getMapTile(this.props.tilePosition.x, this.props.tilePosition.y);
    this.setState({
      showOverlay: false,
      showImagesModal: true,
      editableTile: mapTile.copy()
    });
  },

  editMasks: function() {
    var mapTile = this._rpgMap.getMapTile(this.props.tilePosition.x, this.props.tilePosition.y);
    this.setState({
      showOverlay: false,
      showMasksModal: true,
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
    this.props.onMapUpdated();
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
      {label: 'Edit Levels', onClick: this.editLevels},
      {label: 'Edit Images', onClick: this.editImages},
      {label: 'Edit Masks', onClick: this.editMasks},
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
      showLevelsModal: false,
      showImagesModal: false,
      showMasksModal: false,
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

        <MapModal.EditImagesModal
            showModal={this.state.showImagesModal}
            editableTile={this.state.editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyTileEdit} />

        <MapModal.EditMasksModal
            showModal={this.state.showMasksModal}
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

module.exports = MapCanvas;
