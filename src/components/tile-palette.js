import React from 'react';
import { Panel, Modal, ButtonToolbar, Button, Collapse, Alert } from 'react-bootstrap';
import TileSetService from '../services/tile-sets';
import tilePositionMixin from './tile-position-mixin';
import { tileSize } from '../config';
import { errorMessage, initTile } from '../utils';
import './tile-palette.css';

const emptyTile = initTile('white');

const tileSetService = new TileSetService();

/* =============================================================================
 * COMPONENT: TILE INFO
 * =============================================================================
 */
function TileInfo(props) {
  if (props.tilePosition && props.tile) {
    return (
      <p className="with-top-margin">
        {props.tilePosition.x},{props.tilePosition.y} :: {props.tile.getTileSetName()}:{props.tile.getTileName()}
      </p>
    );
  }
  return (<p className="with-top-margin">-</p>);
}

/* =============================================================================
 * COMPONENT: TILE SET TOOLBAR
 * =============================================================================
 */
function TileSetToolbar(props) {
  return (
    <ButtonToolbar className="component-buttons">
      <Button onClick={props.onLoadTileSetsFromServer}>Open</Button>
      { /* <Button bsStyle="link" onClick={props.onAdmin}>Admin</Button> */ }
    </ButtonToolbar>
  );
}

/* =============================================================================
 * COMPONENT: TILE SET ITEM
 * =============================================================================
 */
function TileSetItem(props) {
  return (<li><a href="#" onClick={function(event) {
    event.preventDefault();
    props.onTileSetSelected(props.tileSet.id);
  }}>{props.tileSet.name}</a></li>);
}

/* =============================================================================
 * COMPONENT: OPEN TILE SET MODAL
 * =============================================================================
 */
function OpenTileSetModal(props) {
  var showError = props.error && props.error.length > 0;

  var items = props.tileSets.map(
    tileSet => <TileSetItem key={tileSet.id} tileSet={tileSet}
        onTileSetSelected={props.onTileSetSelected} />
  );

  return (
    <Modal show={props.showModal} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Open Tileset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Collapse in={showError}>
          <div>
            <Alert bsStyle="danger">{props.error}</Alert>
          </div>
        </Collapse>
        <ul>{items}</ul>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

/* =============================================================================
 * COMPONENT: TILE SET CANVAS
 * =============================================================================
 */
const TileSetCanvas = React.createClass({
  mixins: [tilePositionMixin],

  _tileSet: null,
  _canvas: null,

  getInitialState() {
    return {
      showTileset: false,
    };
  },

  loadTileSet(tilesetId) {
    var p = tileSetService.loadTileSet(tilesetId);
    return p.then(data => {
      if (data.tileSet) {
        this._tileSet = data.tileSet;
        this.drawTileSet();
        this.setState({ showTileset: true });
      }
      return data;
    });
  },

  drawTileSet() {
    var cols = this._tileSet.getCols();
    var rows = this._tileSet.getRows();
    this._canvas.width = cols * tileSize;
    this._canvas.height = rows * tileSize;
    var ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (var x = 0; x < cols; x++) {
      for (var y = 0; y < rows; y++) {
        var tile = this._tileSet.getTile(x, y);
        if (tile) {
          ctx.putImageData(tile.getImage(), x * tileSize, y * tileSize);
        }
        else {
          ctx.drawImage(emptyTile, x * tileSize, y * tileSize);
        }
      }
    }
  },

  // highlightTile(x, y, currentTile) {
  //   if (currentTile) {
  //     var ctx = this._canvas.getContext('2d');
  //     ctx.drawImage(tileHighlight, x * tileSize, y * tileSize)
  //   }
  // },
  //
  // resetTile(x, y, previousTile) {
  //   if (previousTile) {
  //     var ctx = this._canvas.getContext('2d');
  //     ctx.putImageData(previousTile.getImage(), x * tileSize, y * tileSize);
  //   }
  // },

  handleMouseMove(evt) {
    var tilePosition = this.getCurrentTilePosition(evt);
    // if (this.props.tilePosition &&
    //     tilePosition.x === this.props.tilePosition.x &&
    //     tilePosition.y === this.props.tilePosition.y) {
    //   return;
    // }
    var tile = this._tileSet.getTile([tilePosition.x], [tilePosition.y]);
    this.props.onTilePositionUpdated(tilePosition, tile);
  },

  handleMouseOut: function(evt) {
    if (this.isTilePositionWithinCanvas(evt)) {
      return;
    }
    this.props.onTilePositionUpdated();
  },

  handleSelectionOut: function(evt) {
    if (this.isTilePositionWithinCanvas(evt, evt.target.previousSibling)) {
      return;
    }
    this.props.onTilePositionUpdated();
  },

  handleMouseClick() {
    if (this.props.tile) {
      console.log("tile selected: " + this.props.tile);
      this.props.onTileSelected(this.props.tile);
    }
  },

  suppress(evt) {
    evt.preventDefault();
  },

  // componentDidUpdate(oldProps, oldState) {
  //   if (oldProps.tilePosition) {
  //     this.resetTile(oldProps.tilePosition.x, oldProps.tilePosition.y, oldProps.tile);
  //   }
  //   if (this.props.tilePosition) {
  //     this.highlightTile(this.props.tilePosition.x, this.props.tilePosition.y, this.props.tile);
  //   }
  // },

  highlightStyle: function() {
    if (this.props.tilePosition) {
      return {
        left: this.props.tilePosition.x * tileSize,
        top: this.props.tilePosition.y * tileSize,
        display: 'block'
      };
    }
    return { display: 'none' };
  },

  render() {
    var bsClass = this.state.showTileset ? "show tiles" : "hidden";
    return (
      <div className="canvas-container">
        <div className="inner-canvas-container">
          <canvas className={bsClass}
                  onMouseMove={this.handleMouseMove}
                  onMouseOut={this.handleMouseOut}
                  ref={cvs => this._canvas = cvs} />

          <div className="highlight" style={this.highlightStyle()}
               onMouseOut={this.handleSelectionOut}
               onClick={this.handleMouseClick}
               onContextMenu={this.handleRightClick} />
        </div>
      </div>
    );
  }
});

/* =============================================================================
 * COMPONENT: TILE PALETTE
 * =============================================================================
 */
const TilePalette = React.createClass({
  _tileSetCanvas: null,

  getInitialState() {
    return {
      showModal: false,
      tileSets: [],
      tileSetId: null,
      serviceError: null,
      currentTilePosition: null,
      currentTile: null
    };
  },

  closeModal() {
    this.setState({ showModal: false });
  },

  tileSetSelected(tsid) {
    var p = this._tileSetCanvas.loadTileSet(tsid);
    p.then(data => {
      if (data.tileSet) {
        this.closeModal();
        this.setState({
          tileSetId: data.tileSet.getId(),
          serviceError: null
        });
      }
    }, this.tileSetLoadErr).done();
  },

  tileSetLoadErr(data) {
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      this.setState({
        serviceError: errorMessage("Could not load tileset", data)
      });
      return;
    }
    console.log("Something went wrong...");
  },

  loadTileSetsFromServer(event) {
    var p = tileSetService.loadTileSets();
    p.then(data => {
      if (data.tileSets) {
        this.setState({
          tileSets: data.tileSets,
          serviceError: null,
          showModal: true
        });
      }
    }, this.tileSetsLoadErr).done();
  },

  tileSetsLoadErr(data) {
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      this.setState({
        tileSets: [],
        serviceError: errorMessage("Could not load tilesets", data),
        showModal: true
      });
      return;
    }
    console.log("Something went wrong...");
  },

  updateCurrentTile(tilePosition, tile) {
    this.setState({ currentTilePosition: tilePosition, currentTile: tile});
  },

  render() {
    return (
      <div>
        <Panel className="component" bsClass="component-panel">
          <TileSetToolbar
              onLoadTileSetsFromServer={this.loadTileSetsFromServer}
              onAdmin={this.props.onAdmin} />
          <TileSetCanvas
              onTileSelected={this.props.onTileSelected}
              onTilePositionUpdated={this.updateCurrentTile}
              tilePosition={this.state.currentTilePosition}
              tile={this.state.currentTile}
              ref={comp => this._tileSetCanvas = comp} />
          <TileInfo
              tilePosition={this.state.currentTilePosition}
              tile={this.state.currentTile} />
        </Panel>

        <OpenTileSetModal
            showModal={this.state.showModal}
            tileSets={this.state.tileSets}
            onTileSetSelected={this.tileSetSelected}
            onClose={this.closeModal}
            error={this.state.serviceError} />
      </div>
    );
  }
});

export default TilePalette;
