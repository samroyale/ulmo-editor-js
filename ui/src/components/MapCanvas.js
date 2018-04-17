import React from 'react';
import { Overlay, Popover, ButtonGroup, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { EditLevelsModal, EditImagesModal, EditMasksModal } from './MapModal';
import { PlayMapModal } from '../play/play-modal';
import RpgMapService from '../services/RpgMaps';
import { TilePosition } from '../utils';
import { tileSize } from '../config';
import './MapCanvas.css';

const rpgMapService = new RpgMapService();

/* =============================================================================
 * COMPONENT: MAP CANVAS
 * =============================================================================
 */
class MapCanvas extends React.Component {
  constructor(props) {
    super(props);

    this._rpgMap = null;
    this._canvas = null;
    this._mouseDown = null;
    this._clipboard = rpgMapService.emptyClipboard();
    
    this.state = {
      showMap: false,
      showOverlay: false,
      overlayPosition: {x: 0, y: 0},
      showModal: null,
      editableTile: null,
      startPosition: null,
      playLevel: null
    };
  }

  getInitialState = () => {
    return {
      showMap: false,
      showOverlay: false,
      overlayPosition: {x: 0, y: 0},
      showModal: null,
      editableTile: null,
      startPosition: null,
      playLevel: null
    };
  };

  loadMap = mapId => {
    return this.mapLoaded(rpgMapService.loadMap(mapId));
  };

  newMap = (rows, cols) => {
    return this.mapLoaded(rpgMapService.newMap(rows, cols));
  };

  resizeMap = (left, right, top, bottom) => {
    if (this._rpgMap) {
      return this.mapLoaded(rpgMapService.resizeMap(this._rpgMap, left, right, top, bottom));
    }
  };

  mapLoaded = rpgMap => {
    this.removeHighlight(); // resets tile positions
    return rpgMap.then(data => {
      if (data.map) {
        this.applyMap(data.map);
      }
      return data;
    });
  };

  restoreMap = rpgMap => this.applyMap(rpgMap);

  applyMap = rpgMap => {
    this._rpgMap = rpgMap;
    this.drawMap();
    this.setState({ showMap: true });
  };

  saveMap = () => {
    if (this._rpgMap) {
      return rpgMapService.saveMap(this._rpgMap);
    }
  };

  saveMapAs = mapName => {
    if (this._rpgMap) {
      return rpgMapService.saveMapAs(this._rpgMap, mapName);
    }
  };

  drawMap = () => {
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
  };

  updateRange = (fromPosition, toPosition) => {
    this.processRange(fromPosition, toPosition, (topLeft, rows, cols, ctx) => {
      for (var i = topLeft.x; i < topLeft.x + cols; i++) {
        for (var j = topLeft.y; j < topLeft.y + rows; j++) {
          var mapTile = this._rpgMap.getMapTile(i, j);
          ctx.putImageData(mapTile.getImage(), i * tileSize, j * tileSize);
        }
      }
    });
  };

  applySelectedTile = (fromPosition, toPosition) => {
    const { tileMode, selectedTile } = this.props;
    if (tileMode === "ADD") {
      this.processHighlightedTiles((topLeft, rows, cols) => {
        return this._rpgMap.addAsMaskTile(topLeft, rows, cols, selectedTile);
      });
      return;
    }
    if (tileMode === "INSERT") {
      this.processHighlightedTiles((topLeft, rows, cols) => {
        return this._rpgMap.insertAsMaskTile(topLeft, rows, cols, selectedTile);
      });
    }
    // tileMode is either null or SELECT - do nothing
  };

  sendToBack = () => {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      return this._rpgMap.sendToBack(topLeft, rows, cols);
    });
    this.hideOverlay();
  };

  keepTop = () => {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      return this._rpgMap.keepTop(topLeft, rows, cols);
    });
    this.hideOverlay();
  };

  clear = () => {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      return this._rpgMap.clear(topLeft, rows, cols);
    });
    this.hideOverlay();
  };

  editLevels = () => this.showModal("LEVELS");

  editImages = () => this.showModal("IMAGES");

  editMasks = () => this.showModal("MASKS");

  playMap = level => {
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
  };

  restoreSprites = sprites => this.applySpritesEdit(sprites);

  applySpritesEdit = newSprites => {
    return this._rpgMap.setSprites(newSprites);
  };

  getSpritesFromMap = () => {
    return this._rpgMap.getSprites();
  };

  applyLevelsEdit = newLevels => {
    // levels edit applies to all selected tiles
    this.processHighlightedTiles((topLeft, rows, cols) => {
      return this._rpgMap.setLevels(topLeft, rows, cols, newLevels.slice());
    });
    this.closeModal();
  };

  applyTilesEdit = newMaskTiles => {
    const { tilePosition, onMapUpdated } = this.props;
    // tiles edit applies to only the current tile
    var oldTiles = this._rpgMap.setMaskTiles(tilePosition.x, tilePosition.y, newMaskTiles);
    var topLeft = {
      x: tilePosition.x,
      y: tilePosition.y
    }
    onMapUpdated(topLeft, oldTiles);
    this.closeModal();
  };

  processHighlightedTiles = func => {
    const { tilePosition, onMapUpdated } = this.props;
    if (!tilePosition) {
      return;
    }
    var toPosition = tilePosition;
    var fromPosition = this.state.startPosition ? this.state.startPosition : toPosition;
    var tr = this.getTileRange(fromPosition, toPosition);
    var oldTiles = func(tr.topLeft, tr.rows, tr.cols);
    if (oldTiles) {
      onMapUpdated(tr.topLeft, oldTiles);
      this.updateRange(fromPosition, toPosition);
    }
  };

  processRange = (fromPosition, toPosition, func) => {
    if (!toPosition) {
      return;
    }
    var ctx = this._canvas.getContext('2d');
    var tr = this.getTileRange(fromPosition, toPosition);
    func(tr.topLeft, tr.rows, tr.cols, ctx);
  };

  getTileRange = (fromPosition, toPosition) => {
    var x = Math.min(fromPosition.x, toPosition.x);
    var y = Math.min(fromPosition.y, toPosition.y);
    var rows = Math.abs(fromPosition.y - toPosition.y) + 1;
    var cols = Math.abs(fromPosition.x - toPosition.x) + 1;
    return {topLeft: {x: x, y: y}, rows: rows, cols: cols};
  };

  copyTiles = () => {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      return this._rpgMap.copyTiles(topLeft, rows, cols, this._clipboard);
    });
    this.hideOverlay();
  };

  cutTiles = () => {
    this.processHighlightedTiles((topLeft, rows, cols) => {
      return this._rpgMap.cutTiles(topLeft, rows, cols, this._clipboard);
    });
    this.hideOverlay();
  };

  pasteTiles = () => {
    const { tilePosition, onMapUpdated } = this.props;
    var oldTiles = this._rpgMap.pasteTiles(tilePosition, this._clipboard);
    var toPosition = {
      x: tilePosition.x + oldTiles.length - 1,
      y: tilePosition.y + oldTiles[0].length - 1
    }
    this.updateRange(tilePosition, toPosition);
    onMapUpdated(tilePosition, oldTiles);
    this.hideOverlay();
  };

  restoreTiles = (topLeft, tiles) => {
    const { onMapUpdated } = this.props;
    var toPosition = this._rpgMap.restoreTiles(topLeft, tiles);
    this.updateRange(topLeft, toPosition);
    onMapUpdated();
  };

  buttonsMetadata = () => {
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
  };

  playButtonMetadata = multipleSelected => {
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
  };

  multipleTilesSelected = () => {
    const { tilePosition } = this.props;
    var toPosition = tilePosition;
    var fromPosition = this.state.startPosition ? this.state.startPosition : toPosition;
    return (toPosition.x !== fromPosition.x || toPosition.y !== fromPosition.y);
  };

  handleMouseMove = evt => {
    const { onTilePositionUpdated } = this.props;
    if (this.state.showOverlay) {
      return;
    }
    var tilePosition = TilePosition.getCurrentTilePosition(evt);
    if (this.state.startPosition && !this._mouseDown) {
      this.setState({ startPosition: null });
    }
    var tile = this._rpgMap.getMapTile(tilePosition.x, tilePosition.y);
    onTilePositionUpdated(tilePosition, tile);
  };

  handleSelectionMove = evt => {
    const { tilePosition, onTilePositionUpdated } = this.props;
    if (this.state.showOverlay || !this._mouseDown) {
      return;
    }
    var nextTilePosition = TilePosition.getCurrentTilePosition(evt, evt.target.previousSibling);
    if (tilePosition &&
        nextTilePosition.x === tilePosition.x &&
        nextTilePosition.y === tilePosition.y) {
      return;
    }
    var tile = this._rpgMap.getMapTile(nextTilePosition.x, nextTilePosition.y);
    onTilePositionUpdated(nextTilePosition, tile);
  };

  removeHighlight = () => {
    const { onTilePositionUpdated } = this.props;
    if (this.state.showOverlay) {
      return;
    }
    this._mouseDown = false;
    this.setState({ startPosition: null });
    onTilePositionUpdated();
  };

  handleRightClick = evt => {
    evt.preventDefault();
    if (this.state.showOverlay) {
      this.setState({ showOverlay: false });
      return;
    }
    this.setState({
      showOverlay: true,
      overlayTarget: evt.target
    });
  };

  handleMouseDown = evt => {
    const { onTilePositionUpdated } = this.props;
    if (this.state.showOverlay) {
      return;
    }
    if (evt.button !== 0) {
      return;
    }
    this._mouseDown = true;
    var tilePosition = TilePosition.getCurrentTilePosition(evt, evt.target.previousSibling);
    this.setState({ startPosition: tilePosition});
    var tile = this._rpgMap.getMapTile(tilePosition.x, tilePosition.y);
    onTilePositionUpdated(tilePosition, tile);
  };

  handleMouseUp = evt => {
    const { tilePosition, selectedTile } = this.props;
    if (evt.button !== 0) {
      return;
    }
    this._mouseDown = false;
    if (!selectedTile) {
      return;
    }
    this.applySelectedTile(this.state.startPosition, tilePosition);
  };

  handleMouseOut = evt => {
    if (TilePosition.isTilePositionWithinCanvasView(evt)) {
      return;
    }
    this.removeHighlight();
  };

  handleSelectionOut = evt => {
    if (TilePosition.isTilePositionWithinCanvasView(evt, evt.target.previousSibling)) {
      return;
    }
    this.removeHighlight();
  };

  hideOverlay = () => this.setState({ showOverlay: false });

  currentTile = () => {
    const { tilePosition } = this.props;
    return this._rpgMap.getMapTile(tilePosition.x, tilePosition.y);
  };

  showModal = name => {
    this.setState({
      showModal: name,
      showOverlay: false,
      editableTile: this.currentTile().copy()
    });
  };

  closeModal = () => {
    this.setState({
      showModal: null,
      editableTile: null
    });
  };

  highlightStyle = () => {
    const { tilePosition } = this.props;
    if (this.state.startPosition) {
      var tr = this.getTileRange(this.state.startPosition, tilePosition);
      return {
        left: tr.topLeft.x * tileSize,
        top: tr.topLeft.y * tileSize,
        width: tr.cols * tileSize,
        height: tr.rows * tileSize,
        display: 'block'
      };
    }
    if (tilePosition) {
      return {
        left: tilePosition.x * tileSize,
        top: tilePosition.y * tileSize,
        display: 'block'
      };
    }
    return {};
  };

  render = () => {
    const { tilePosition } = this.props;
    const { showMap, showOverlay, overlayTarget, showModal, editableTile, playLevel } = this.state;
    const bsClass = showMap ? "show" : "hidden";
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
              showOverlay={showOverlay}
              target={overlayTarget}
              buttons={this.buttonsMetadata()}
              onHide={this.hideOverlay} />
        </div>


        <EditLevelsModal
            showModal={showModal === "LEVELS"}
            editableTile={editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyLevelsEdit} />

        <EditImagesModal
            showModal={showModal === "IMAGES"}
            editableTile={editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyTilesEdit} />

        <EditMasksModal
            showModal={showModal === "MASKS"}
            editableTile={editableTile}
            onClose={this.closeModal}
            onSubmit={this.applyTilesEdit} />

        <PlayMapModal
            showModal={showModal === "PLAY"}
            tilePosition={tilePosition}
            level={playLevel}
            rpgMap={this._rpgMap}
            onClose={this.closeModal} />
      </div>
    );
  }
}

/* =============================================================================
 * COMPONENT: SELECTION POPUP
 * =============================================================================
 */
const SelectionPopup = ({ buttons, showOverlay, onHide, target }) => {
  var popupButtons = buttons.map(button => {
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
      show={showOverlay}
      onHide={onHide}
      rootClose={true}
      target={target}
      placement="right">
      <Popover id="popover-basic">
        <ButtonGroup vertical block>{popupButtons}</ButtonGroup>
      </Popover>
    </Overlay>
  )
}

export default MapCanvas;
