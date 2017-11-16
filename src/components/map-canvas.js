import React from 'react';
import { Overlay, Popover, ButtonGroup, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { EditLevelsModal, EditImagesModal, EditMasksModal } from './map-modal';
import { PlayMapModal } from '../play/play-modal';
import RpgMapService from '../services/rpg-maps';
import tilePositionMixin from './tile-position-mixin';
import { tileSize } from '../config';
import { initHighlight, initTileHighlight } from '../utils';
import './map-canvas.css';
import ReactDOM from 'react-dom';


// const tileHighlight = initTileHighlight();

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
  _clipboard: rpgMapService.emptyClipboard(),

  getInitialState: function() {
    return {
      showMap: false,
      showOverlay: false,
      overlayPosition: {x: 0, y: 0},
      showModal: null,
      editableTile: null,
      startPosition: null,
      playLevel: null
    };
  },

  loadMap: function(mapId) {
    return this.mapLoaded(rpgMapService.loadMap(mapId));
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
        this.applyMap(data.map);
      }
      return data;
    });
  },

  restoreMap: function(rpgMap) {
    this.applyMap(rpgMap);
  },

  applyMap: function(rpgMap) {
    this._rpgMap = rpgMap;
    this.drawMap();
    this.setState({ showMap: true });
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

  // unhighlightTile: function(tilePosition) {
  //   if (!tilePosition) {
  //     return;
  //   }
  //   this._canvas.getContext('2d').putImageData(
  //     this._rpgMap.getMapTile(tilePosition.x, tilePosition.y).getImage(),
  //     tilePosition.x * tileSize,
  //     tilePosition.y * tileSize
  //   );
  // },

  // highlightTile: function(tilePosition) {
  //   if (!tilePosition) {
  //     return;
  //   }
  //   this._canvas.getContext('2d').drawImage(
  //     tileHighlight,
  //     tilePosition.x * tileSize,
  //     tilePosition.y * tileSize
  //   );
  // },

  // highlightRange: function(fromPosition, toPosition) {
  //   this.processRange(fromPosition, toPosition, (topLeft, rows, cols, ctx) => {
  //     var highlight = initHighlight(rows, cols);
  //     ctx.drawImage(highlight, topLeft.x * tileSize, topLeft.y * tileSize);
  //   });
  // },

  updateRange: function(fromPosition, toPosition) {
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
        return this._rpgMap.addAsMaskTile(topLeft, rows, cols, this.props.selectedTile);
      });
      return;
    }
    if (this.props.tileMode === "INSERT") {
      this.processHighlightedTiles((topLeft, rows, cols) => {
        return this._rpgMap.insertAsMaskTile(topLeft, rows, cols, this.props.selectedTile);
      });
    }
    // tileMode is either null or SELECT - do nothing
  },

  sendToBack: function() {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      return this._rpgMap.sendToBack(topLeft, rows, cols);
    });
    this.hideOverlay();
  },

  keepTop: function() {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      return this._rpgMap.keepTop(topLeft, rows, cols);
    });
    this.hideOverlay();
  },

  clear: function() {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      return this._rpgMap.clear(topLeft, rows, cols);
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

  playMap: function(level) {
    if (level.startsWith('S')) {
      this.setState({ playLevel: parseInt(level.slice(1), 10) });
    }
    else if (level.startsWith('D')) {
      let levels = level.slice(1).split('-');
      this.setState({ playLevel: parseInt(levels[0], 10) });
    }
    else {
      this.setState({ playLevel: parseInt(level, 10) });
    }
    this.showModal("PLAY");
  },

  restoreSprites: function(sprites) {
    this.applySpritesEdit(sprites);
  },

  applySpritesEdit: function(newSprites) {
    return this._rpgMap.setSprites(newSprites);
  },

  getSpritesFromMap: function() {
    return this._rpgMap.getSprites();
  },

  applyLevelsEdit: function(newLevels) {
    // levels edit applies to all selected tiles
    this.processHighlightedTiles((topLeft, rows, cols) => {
      return this._rpgMap.setLevels(topLeft, rows, cols, newLevels.slice());
    });
    this.closeModal();
  },

  applyTilesEdit: function(newMaskTiles) {
    // tiles edit applies to only the current tile
    var oldTiles = this._rpgMap.setMaskTiles(this.props.tilePosition.x, this.props.tilePosition.y, newMaskTiles);
    var topLeft = {
      x: this.props.tilePosition.x,
      y: this.props.tilePosition.y
    }
    this.props.onMapUpdated(topLeft, oldTiles);
    this.closeModal();
  },

  processHighlightedTiles: function(func) {
    if (!this.props.tilePosition) {
      return;
    }
    var toPosition = this.props.tilePosition;
    var fromPosition = this.state.startPosition ? this.state.startPosition : toPosition;
    var tr = this.getTileRange(fromPosition, toPosition);
    var oldTiles = func(tr.topLeft, tr.rows, tr.cols);
    if (oldTiles) {
      this.props.onMapUpdated(tr.topLeft, oldTiles);
      this.updateRange(fromPosition, toPosition);
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
      return this._rpgMap.copyTiles(topLeft, rows, cols, this._clipboard);
    });
    this.hideOverlay();
  },

  cutTiles: function() {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      return this._rpgMap.cutTiles(topLeft, rows, cols, this._clipboard);
    });
    this.hideOverlay();
  },

  pasteTiles: function() {
    var oldTiles = this._rpgMap.pasteTiles(this.props.tilePosition, this._clipboard);
    var toPosition = {
      x: this.props.tilePosition.x + oldTiles.length - 1,
      y: this.props.tilePosition.y + oldTiles[0].length - 1
    }
    this.updateRange(this.props.tilePosition, toPosition);
    this.props.onMapUpdated(this.props.tilePosition, oldTiles);
    this.hideOverlay();
  },

  restoreTiles: function(topLeft, tiles) {
    var toPosition = this._rpgMap.restoreTiles(topLeft, tiles);
    this.updateRange(topLeft, toPosition);
    this.props.onMapUpdated();
  },

  buttonsMetadata: function() {
    if (!this.state.showOverlay) {
      return [];
    }
    var multipleSelected = this.multipleTilesSelected();
    var pasteInvalid = this._clipboard === null || multipleSelected;
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
        {label: 'Paste', onClick: this.pasteTiles, disabled: pasteInvalid}
      ]},
      this.playButtonMetadata(multipleSelected)
    ];
  },

  playButtonMetadata: function(multipleSelected) {
    var availableLevels = this.currentTile().getLevels();
    if (multipleSelected || availableLevels.length === 0) {
      return {label: 'PLAY!', onClick: this.playMap, disabled: true};
    }
    if (availableLevels.length === 1) {
      return {label: 'PLAY!', onClick: () => this.playMap(availableLevels[0])};
    }
    return {
      label: 'PLAY!',
      menuItems: availableLevels.map(level => {
        return {
          label: 'Level: ' + level,
          onClick: () => this.playMap(level),
        };
      })
    }
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
    // if (this.props.tilePosition &&
    //     tilePosition.x === this.props.tilePosition.x &&
    //     tilePosition.y === this.props.tilePosition.y) {
    //   return;
    // }
    if (this.state.startPosition && !this._mouseDown) {
      this.setState({ startPosition: null });
    }
    var tile = this._rpgMap.getMapTile(tilePosition.x, tilePosition.y);
    this.props.onTilePositionUpdated(tilePosition, tile);
  },

  handleSelectionMove: function(evt) {
    if (this.state.showOverlay) {
      return;
    }
    if (!this._mouseDown) {
      return;
    }
    var tilePosition = this.getCurrentTilePosition(evt, evt.target.previousSibling);
    if (this.props.tilePosition &&
        tilePosition.x === this.props.tilePosition.x &&
        tilePosition.y === this.props.tilePosition.y) {
      return;
    }
    // if (this.state.startPosition && !this._mouseDown) {
    //   this.setState({ startPosition: null });
    // }
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
      overlayTarget: evt.target
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
    var tilePosition = this.getCurrentTilePosition(evt, evt.target.previousSibling);
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

  handleMouseOut: function(evt) {
    if (this.isTilePositionWithinCanvas(evt)) {
      return;
    }
    this.removeHighlight();
  },

  handleSelectionOut: function(evt) {
    if (this.isTilePositionWithinCanvas(evt, evt.target.previousSibling)) {
      return;
    }
    this.removeHighlight();
  },

//  componentDidUpdate: function(oldProps, oldState) {
    // if (oldState.startPosition) {
    //   this.updateRange(oldState.startPosition, oldProps.tilePosition);
    //   if (this.state.startPosition) {
    //     this.highlightRange(this.state.startPosition, this.props.tilePosition);
    //     return;
    //   }
    // }
    // this.unhighlightTile(oldProps.tilePosition);
    // this.highlightTile(this.props.tilePosition);
//  },

  hideOverlay: function() {
    this.setState({ showOverlay: false });
  },

  currentTile: function() {
    return this._rpgMap.getMapTile(this.props.tilePosition.x, this.props.tilePosition.y);
  },

  showModal: function(name) {
    this.setState({
      showModal: name,
      showOverlay: false,
      editableTile: this.currentTile().copy()
    });
  },

  closeModal: function() {
    this.setState({
      showModal: null,
      editableTile: null
    });
  },

  highlightStyle: function() {
    if (this.state.startPosition) {
      var tr = this.getTileRange(this.state.startPosition, this.props.tilePosition);
      return {
        left: tr.topLeft.x * tileSize,
        top: tr.topLeft.y * tileSize,
        width: tr.cols * tileSize,
        height: tr.rows * tileSize,
        display: 'block'
      };
    }
    if (this.props.tilePosition) {
      return {
        left: this.props.tilePosition.x * tileSize,
        top: this.props.tilePosition.y * tileSize,
        display: 'block'
      };
    }
    return { display: 'none' };
  },

  render: function() {
    var bsClass = this.state.showMap ? "show" : "hidden";
    return (
      <div className="canvas-container">
        <div className="inner-canvas-container">
          <canvas className={bsClass}
              onMouseMove={this.handleMouseMove}
              onMouseOut={this.handleMouseOut}
              ref={cvs => this._canvas = cvs} />

          <div className="highlight" style={this.highlightStyle()}
              onMouseMove={this.handleSelectionMove}
              onMouseDown={this.handleMouseDown}
              onMouseUp={this.handleMouseUp}
              onMouseOut={this.handleSelectionOut}
              onContextMenu={this.handleRightClick} />

          <SelectionPopup
              showOverlay={this.state.showOverlay}
              target={this.state.overlayTarget}
              buttons={this.buttonsMetadata()}
              onHide={this.hideOverlay} />
        </div>


        <EditLevelsModal
            showModal={this.state.showModal === "LEVELS"}
            editableTile={this.state.editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyLevelsEdit} />

        <EditImagesModal
            showModal={this.state.showModal === "IMAGES"}
            editableTile={this.state.editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyTilesEdit} />

        <EditMasksModal
            showModal={this.state.showModal === "MASKS"}
            editableTile={this.state.editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyTilesEdit} />

        <PlayMapModal
            showModal={this.state.showModal === "PLAY"}
            tilePosition={this.props.tilePosition}
            level={this.state.playLevel}
            rpgMap={this._rpgMap}
            onClose={this.closeModal} />
      </div>
    );
  }
});

/* =============================================================================
 * COMPONENT: SELECTION POPUP
 * =============================================================================
 */
function SelectionPopup(props) {
  var buttons = props.buttons.map(button => {
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

  return (
    <Overlay
        show={props.showOverlay}
        onHide={props.onHide}
        rootClose={true}
        target={props.target}
        placement="right">
      <Popover id="popover-basic">
        <ButtonGroup vertical block>{buttons}</ButtonGroup>
      </Popover>
    </Overlay>
  )
}

export default MapCanvas;
