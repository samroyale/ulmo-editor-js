import React from 'react';
import { Panel, Modal, ButtonToolbar, Button, Collapse, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import TileSetService from '../services/TileSets';
import { TilePosition } from '../utils';
import { tileSize } from '../config';
import { initTile } from '../utils';
import './TilePalette.css';

const emptyTile = initTile('white');

const tileSetService = new TileSetService();

/* =============================================================================
 * COMPONENT: TILE INFO
 * =============================================================================
 */
const TileInfo = ({ tilePosition, tile }) => {
  if (tilePosition && tile) {
    return (
      <p className="with-top-margin">
        {tilePosition.x},{tilePosition.y} :: {tile.getTileSetName()}:{tile.getTileName()}
      </p>
    );
  }
  return (<p className="with-top-margin">-</p>);
}

/* =============================================================================
 * COMPONENT: TILE SET TOOLBAR
 * =============================================================================
 */
const TileSetToolbar = ({ onLoadTileSetsFromServer, onAdmin }) => (
  <ButtonToolbar className="component-buttons">
    <Button onClick={onLoadTileSetsFromServer}>Open</Button>
    { /* <Button bsStyle="link" onClick={onAdmin}>Admin</Button> */ }
  </ButtonToolbar>
);

/* =============================================================================
 * COMPONENT: OPEN TILE SET MODAL
 * =============================================================================
 */
const OpenTileSetModal = ({ error, tileSets, onTileSetSelected, showModal, onClose }) => {
  var showError = error && error.length > 0;

  var items = tileSets.map(tileSet =>
    <ListGroupItem className="tileset-item" onClick={() => onTileSetSelected(tileSet.id)}>
      {tileSet.name}
    </ListGroupItem>
  );

  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Open Tileset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Collapse in={showError}>
          <div>
            <Alert bsStyle="danger">{error}</Alert>
          </div>
        </Collapse>
        <ListGroup className="tilesets-list">{items}</ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

/* =============================================================================
 * COMPONENT: TILE SET CANVAS
 * =============================================================================
 */
class TileSetCanvas extends React.Component {
  constructor(props) {
    super(props);
    this._canvas = React.createRef();
    this.state = {
      showTileset: false,
    };
  }

  loadTileSet = async tilesetId => {
    var data = await tileSetService.loadTileSet(tilesetId);
    if (data.tileSet) {
      this._tileSet = data.tileSet;
      this.drawTileSet();
      this.setState({ showTileset: true });
    }
    return data;
  };

  drawTileSet = () => {
    const cols = this._tileSet.getCols();
    const rows = this._tileSet.getRows();
    const canvas = this._canvas.current;
    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  };

  handleMouseMove = evt => {
    var tilePosition = TilePosition.getCurrentTilePosition(evt);
    var tile = this._tileSet.getTile([tilePosition.x], [tilePosition.y]);
    this.props.onTilePositionUpdated(tilePosition, tile);
  };

  handleMouseOut = evt => {
    if (TilePosition.isTilePositionWithinCanvasView(evt)) {
      return;
    }
    this.props.onTilePositionUpdated();
  };

  handleSelectionOut = evt => {
    if (TilePosition.isTilePositionWithinCanvasView(evt, evt.target.previousSibling)) {
      return;
    }
    this.props.onTilePositionUpdated();
  };

  handleMouseClick = () => {
    if (this.props.tile) {
      console.log("tile selected: " + this.props.tile);
      this.props.onTileSelected(this.props.tile);
    }
  };

  suppress = evt => evt.preventDefault();

  highlightStyle = ({ tilePosition }) => {
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
    var bsClass = this.state.showTileset ? "show tiles" : "hidden";
    return (
      <div className="canvas-container">
        <div className="inner-canvas-container">
          <canvas className={bsClass}
                  onMouseMove={this.handleMouseMove}
                  onMouseOut={this.handleMouseOut}
                  ref={this._canvas} />

          <div className="highlight" style={this.highlightStyle(this.props)}
               onMouseOut={this.handleSelectionOut}
               onClick={this.handleMouseClick}
               onContextMenu={this.suppress} />
        </div>
      </div>
    );
  }
}

/* =============================================================================
 * COMPONENT: TILE PALETTE
 * =============================================================================
 */
class TilePalette extends React.Component {
  constructor(props) {
    super(props);
    this._tileSetCanvas = React.createRef();
    this.state = {
      showModal: false,
      tileSets: [],
      tileSetId: null,
      serviceError: null,
      currentTilePosition: null,
      currentTile: null
    };
  }

  closeModal = () => this.setState({ showModal: false });

  tileSetSelected = async tsid => {
    try {
      var { tileSet } = await this._tileSetCanvas.current.loadTileSet(tsid);
      this.closeModal();
      this.setState({
        tileSetId: tileSet.getId(),
        serviceError: null
      });
    } catch(e) {
      this.tileSetLoadErr(e);
    }
  };

  tileSetLoadErr = ({ message }) => {
    if (message) {
      this.setState({ serviceError: message });
      return;
    }
    console.log("Something went wrong...");
  };

  loadTileSetsFromServer = async evt => {
    try {
      var { tileSets } = await tileSetService.loadTileSets();
      this.setState({
        tileSets: tileSets,
        serviceError: null,
        showModal: true
      });
    } catch(e) {
      this.tileSetsLoadErr(e);
    }
  }

  tileSetsLoadErr = ({ message }) => {
    if (message) {
      this.setState({
        tileSets: [],
        serviceError: message,
        showModal: true
      });
      return;
    }
    console.log("Something went wrong...");
  };

  updateCurrentTile = (tilePosition, tile) => this.setState({ currentTilePosition: tilePosition, currentTile: tile});

  render = () => {
    const { onAdmin, onTileSelected } = this.props;
    return (
      <div>
        <Panel className="component" bsClass="component-panel">
          <TileSetToolbar
              onLoadTileSetsFromServer={this.loadTileSetsFromServer}
              onAdmin={onAdmin} />
          <TileSetCanvas
              onTileSelected={onTileSelected}
              onTilePositionUpdated={this.updateCurrentTile}
              tilePosition={this.state.currentTilePosition}
              tile={this.state.currentTile}
              ref={this._tileSetCanvas} />
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
}

export default TilePalette;
