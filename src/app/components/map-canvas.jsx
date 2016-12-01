var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    MapModal = require('./map-modal.jsx'),
    RpgMapService = require('./rpg-maps.js'),
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

const rpgMapService = new RpgMapService();

/* =============================================================================
 * COMPONENT: MAP CANVAS
 * =============================================================================
 */
const MapCanvas = React.createClass({
  mixins: [tilePositionMixin],

  _rpgMap: null,
  _canvas: null,
  _mouseDown: null,
  _clipboard: null,

  getInitialState: function() {
    return {
      showMap: false,
      showOverlay: false,
      overlayPosition: {x: 0, y: 0},
      showModal: null,
      editableTile: null,
      startPosition: null
    };
  },

  loadMap: function(mapId) {
    return this.mapLoaded(rpgMapService.loadMap(mapId, this.props.onProgress));
  },

  newMap: function(rows, cols) {
    return this.mapLoaded(rpgMapService.newMap(rows, cols));
  },

  resizeMap: function(left, right, top, bottom) {
    if (this._rpgMap) {
      return this.mapLoaded(rpgMapService.resizeMap(this._rpgMap, left, right, top, bottom));
    }
  },

  mapLoaded: function(rpgMap) {
    this.removeHighlight(); // resets tile positions
    return rpgMap.then(data => {
      if (data.map) {
        this._rpgMap = data.map;
        this.drawMap();
        this.setState({ showMap: true });
      }
      return data;
    });
  },

  saveMap: function() {
    if (this._rpgMap) {
      return rpgMapService.saveMap(this._rpgMap);
    }
  },

  saveMapAs: function(mapName) {
    if (this._rpgMap) {
      return rpgMapService.saveMapAs(this._rpgMap, mapName);
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
    this.processRange(fromPosition, toPosition, (topLeft, rows, cols, ctx) => {
      var highlight = initHighlight(rows, cols);
      ctx.drawImage(highlight, topLeft.x * tileSize, topLeft.y * tileSize);
    });
  },

  unhighlightRange: function(fromPosition, toPosition) {
    this.processRange(fromPosition, toPosition, (topLeft, rows, cols, ctx) => {
      for (var i = topLeft.x; i < topLeft.x + cols; i++) {
        for (var j = topLeft.y; j < topLeft.y + rows; j++) {
          var mapTile = this._rpgMap.getMapTile(i, j);
          ctx.putImageData(mapTile.getImage(), i * tileSize, j * tileSize);
        }
      }
    });
  },

  applySelectedTile: function(fromPosition, toPosition) {
    if (this.props.tileMode === "ADD") {
      this.processHighlightedTiles((topLeft, rows, cols) => {
        this._rpgMap.addAsMaskTile(topLeft, rows, cols, this.props.selectedTile);
        return true;
      });
      return;
    }
    if (this.props.tileMode === "INSERT") {
      this.processHighlightedTiles((topLeft, rows, cols) => {
        this._rpgMap.insertAsMaskTile(topLeft, rows, cols, this.props.selectedTile);
        return true;
      });
    }
    // tileMode is either null or SELECT - do nothing
  },

  sendToBack: function() {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      this._rpgMap.sendToBack(topLeft, rows, cols);
      return true;
    });
    this.hideOverlay();
  },

  keepTop: function() {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      this._rpgMap.keepTop(topLeft, rows, cols);
      return true;
    });
    this.hideOverlay();
  },

  clear: function() {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      this._rpgMap.clear(topLeft, rows, cols);
      return true;
    });
    this.hideOverlay();
  },

  editLevels: function() {
    this.showModal("LEVELS");
  },

  editImages: function() {
    this.showModal("IMAGES");
  },

  editMasks: function() {
    this.showModal("MASKS");
  },

  applyLevelsEdit: function(newLevels) {
    // levels edit applies to all selected tiles
    this.processHighlightedTiles((topLeft, rows, cols) => {
      this._rpgMap.setLevels(topLeft, rows, cols, newLevels.slice(0));
      return true;
    });
    this.closeModal();
  },

  applyTilesEdit: function(newMaskTiles) {
    // tiles edit applies to only the current tile
    var oldTile = this._rpgMap.setMaskTiles(this.props.tilePosition.x, this.props.tilePosition.y, newMaskTiles);
    var topLeft = {
      x: this.props.tilePosition.x,
      y: this.props.tilePosition.y
    }
    this.props.onMapUpdated(topLeft, [[oldTile]]);
    this.closeModal();
  },

  processHighlightedTiles: function(func) {
    if (!this.props.tilePosition) {
      return;
    }
    var toPosition = this.props.tilePosition;
    var fromPosition = this.state.startPosition ? this.state.startPosition : toPosition;
    var tr = this.getTileRange(fromPosition, toPosition);
    var oldTiles = this._rpgMap.copyTiles(tr.topLeft, tr.rows, tr.cols);
    var updated = func(tr.topLeft, tr.rows, tr.cols);
    if (updated) {
      this.props.onMapUpdated(tr.topLeft, oldTiles);
    }
  },

  processRange: function(fromPosition, toPosition, func) {
    if (!toPosition) {
      return;
    }
    var ctx = this._canvas.getContext('2d');
    var tr = this.getTileRange(fromPosition, toPosition);
    func(tr.topLeft, tr.rows, tr.cols, ctx);
  },

  getTileRange: function(fromPosition, toPosition) {
    var x = Math.min(fromPosition.x, toPosition.x);
    var y = Math.min(fromPosition.y, toPosition.y);
    var rows = Math.abs(fromPosition.y - toPosition.y) + 1;
    var cols = Math.abs(fromPosition.x - toPosition.x) + 1;
    return {topLeft: {x: x, y: y}, rows: rows, cols: cols};
  },

  copyTiles: function() {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      this._clipboard = this._rpgMap.copyTiles(topLeft, rows, cols);
      return false;
    });
    this.hideOverlay();
  },

  cutTiles: function() {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      this._clipboard = this._rpgMap.cutTiles(topLeft, rows, cols);
      return true;
    });
    this.hideOverlay();
  },

  pasteTiles: function() {
    var oldTiles = this._rpgMap.pasteTiles(this.props.tilePosition, this._clipboard);
    var toPosition = {
      x: this.props.tilePosition.x + oldTiles.length - 1,
      y: this.props.tilePosition.y + oldTiles[0].length - 1
    }
    this.unhighlightRange(this.props.tilePosition, toPosition);
    this.props.onMapUpdated(this.props.tilePosition, oldTiles);
    this.hideOverlay();
  },

  applyTiles: function(topLeft, tiles) {
    var toPosition = this._rpgMap.applyTiles(topLeft, tiles);
    this.unhighlightRange(topLeft, toPosition);
    this.props.onMapUpdated();
  },

  buttonsMetadata: function() {
    if (!this.state.showOverlay) {
      return [];
    }
    var multipleSelected = this.multipleTilesSelected();
    var pasteUnavailable = this._clipboard === null || multipleSelected;
    return [
      {label: 'Send to back', onClick: this.sendToBack},
      {label: 'Keep top', onClick: this.keepTop},
      {label: 'Clear', onClick: this.clear},
      {label: 'Edit tile', menuItems: [
        {label: 'Edit Levels', onClick: this.editLevels},
        {label: 'Edit Images', onClick: this.editImages, disabled: multipleSelected},
        {label: 'Edit Masks', onClick: this.editMasks, disabled: multipleSelected}
      ]},
      {label: 'Edit', menuItems: [
        {label: 'Cut', onClick: this.cutTiles},
        {label: 'Copy', onClick: this.copyTiles},
        {label: 'Paste', onClick: this.pasteTiles, disabled: pasteUnavailable}
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

  removeHighlight: function() {
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

  showModal: function(name) {
    var mapTile = this._rpgMap.getMapTile(this.props.tilePosition.x, this.props.tilePosition.y);
    this.setState({
      showModal: name,
      showOverlay: false,
      editableTile: mapTile.copy()
    });
  },

  closeModal: function() {
    this.setState({
      showModal: null,
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
            onMouseOut={this.removeHighlight}
            onContextMenu={this.handleRightClick}
            ref={cvs => this._canvas = cvs} />

        <MapCanvasPopup
            showOverlay={this.state.showOverlay}
            position={this.state.overlayPosition}
            buttons={this.buttonsMetadata()}
            onHide={this.hideOverlay} />

        <MapModal.EditLevelsModal
            showModal={this.state.showModal === "LEVELS"}
            editableTile={this.state.editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyLevelsEdit} />

        <MapModal.EditImagesModal
            showModal={this.state.showModal === "IMAGES"}
            editableTile={this.state.editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyTilesEdit} />

        <MapModal.EditMasksModal
            showModal={this.state.showModal === "MASKS"}
            editableTile={this.state.editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyTilesEdit} />
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
