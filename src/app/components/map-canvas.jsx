var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    RpgMapService = require('./rpg-maps.js'),
    MapModal = require('./map-modal.jsx'),
    tilePositionMixin = require('./tile-position-mixin.js'),
    tileSize = require('../config.js').tileSize,
    initHighlight = require('../utils.js').initHighlight;
    initTileHighlight = require('../utils.js').initTileHighlight;

var Overlay = Bootstrap.Overlay,
    ButtonGroup = Bootstrap.ButtonGroup,
    Button = Bootstrap.Button,
    DropdownButton = Bootstrap.DropdownButton,
    MenuItem = Bootstrap.MenuItem;

const tileHighlight = initTileHighlight();

/* =============================================================================
 * COMPONENT: MAP CANVAS
 * =============================================================================
 */
const MapCanvas = React.createClass({
  mixins: [tilePositionMixin],

  _rpgMap: null,
  _canvas: null,
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
      tileHighlight,
      tilePosition.x * tileSize,
      tilePosition.y * tileSize
    );
  },

  highlightRange: function(fromPosition, toPosition) {
    this.processRange(fromPosition, toPosition, (x, y, cols, rows, ctx) => {
      var highlight = initHighlight(rows, cols);
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

  applySelectedTile: function(fromPosition, toPosition) {
    if (this.props.tileMode === "ADD") {
      this.processHighlightedTiles(mapTile =>
        mapTile.addAsMaskTile(this.props.selectedTile)
      );
      return;
    }
    if (this.props.tileMode === "INSERT") {
      this.processHighlightedTiles(mapTile =>
        mapTile.insertAsMaskTile(this.props.selectedTile)
      );
    }
    // tileMode is either null or SELECT - do nothing
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
      editableTile: mapTile
    });
  },

  editImages: function() {
    var mapTile = this._rpgMap.getMapTile(this.props.tilePosition.x, this.props.tilePosition.y);
    this.setState({
      showOverlay: false,
      showImagesModal: true,
      editableTile: mapTile
    });
  },

  editMasks: function() {
    var mapTile = this._rpgMap.getMapTile(this.props.tilePosition.x, this.props.tilePosition.y);
    this.setState({
      showOverlay: false,
      showMasksModal: true,
      editableTile: mapTile
    });
  },

  applyLevelsEdit: function(newLevels) {
    // levels edit applies to all selected tiles
    this.processHighlightedTiles(mapTile => {
      mapTile.setLevels(newLevels.slice(0));
    });
    this.closeModal();
    this.props.onMapUpdated();
  },

  applyMaskTilesEdit: function(newMaskTiles) {
    // mask tiles edit applies to only the current tile
    var mapTile = this._rpgMap.getMapTile(this.props.tilePosition.x, this.props.tilePosition.y);
    mapTile.setMaskTiles(newMaskTiles);
    this.closeModal();
    this.props.onMapUpdated();
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
    var multipleSelected = this.multipleTilesSelected();
    return [
      {label: 'Send to back', onClick: this.sendToBack},
      {label: 'Keep top', onClick: this.keepTop},
      {label: 'Clear', onClick: this.clear},
      {label: 'Edit', menuItems: [
        {label: 'Edit Levels', onClick: this.editLevels},
        {label: 'Edit Images', onClick: this.editImages, disabled: multipleSelected},
        {label: 'Edit Masks', onClick: this.editMasks, disabled: multipleSelected}
      ]}
    ];
  },

  multipleTilesSelected: function() {
    var toPosition = this.props.tilePosition;
    var fromPosition = this.state.startPosition ? this.state.startPosition : toPosition;
    return (toPosition.x !== fromPosition.x || toPosition.y !== fromPosition.y);
  },

  handleMouseMove: function(evt) {
    if (this.state.showOverlay) {
      return;
    }
    var tilePosition = this.getCurrentTilePosition(evt);
    if (this.props.tilePosition &&
        tilePosition.x === this.props.tilePosition.x &&
        tilePosition.y === this.props.tilePosition.y) {
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
    if (this.state.showOverlay) {
      this.setState({ showOverlay: false });
      return;
    }
    this.setState({
      showOverlay: true,
      overlayPosition: this.getOverlayPosition(evt)
    });
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

        <MapModal.EditLevelsModal
            showModal={this.state.showLevelsModal}
            editableTile={this.state.editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyLevelsEdit} />

        <MapModal.EditImagesModal
            showModal={this.state.showImagesModal}
            editableTile={this.state.editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyMaskTilesEdit} />

        <MapModal.EditMasksModal
            showModal={this.state.showMasksModal}
            editableTile={this.state.editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyMaskTilesEdit} />
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

  buttonGroup: function() {
    var buttons = this.props.buttons.map(button => {
      if (!button.menuItems) {
        return (<Button key={button.label} disabled={button.disabled}
            onClick={button.onClick}>{button.label}</Button>);
      }
      var menuItems = button.menuItems.map(menuItem =>
        <MenuItem key={menuItem.label} disabled={menuItem.disabled}
            onClick={menuItem.onClick}>{menuItem.label}</MenuItem>
      );
      return (
        <DropdownButton id={button.label} key={button.label} title={button.label}>
          {menuItems}
        </DropdownButton>
      );
    });
    return (<ButtonGroup vertical>{buttons}</ButtonGroup>);
  },

  render: function() {
    var style = {
      marginLeft: this.props.position.x,
      marginTop: this.props.position.y
    };
    return (
      <Overlay
        show={this.props.showOverlay}
        rootClose={true}
        onHide={this.props.onHide}>
        <div className="map-overlay" style={style} onContextMenu={this.suppress}>
          {this.buttonGroup()}
        </div>
      </Overlay>
    );
  }
});

module.exports = MapCanvas;
