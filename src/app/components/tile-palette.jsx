var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    TileSetService = require('./tile-sets.js'),
    tilePositionMixin = require('./tile-position-mixin.js'),
    tileSize = require('../config.js').tileSize,
    initTile = require('../utils.js').initTile,
    initTileHighlight = require('../utils.js').initTileHighlight;

var Panel = Bootstrap.Panel,
    Modal = Bootstrap.Modal,
    ButtonToolbar = Bootstrap.ButtonToolbar,
    Button = Bootstrap.Button,
    Collapse = Bootstrap.Collapse,
    Alert = Bootstrap.Alert;

const emptyTile = initTile("white"),
    tileHighlight = initTileHighlight();

/* =============================================================================
 * COMPONENT: TILE PALETTE
 * =============================================================================
 */
const TilePalette = React.createClass({
  _tileSetCanvas: null,

  getInitialState: function() {
    return {
      showModal: false,
      tileSets: [],
      tileSetId: null,
      loadError: null,
      currentTilePosition: null,
      currentTile: null
    };
  },

  closeModal: function() {
    this.setState({ showModal: false });
  },

  tileSetSelected: function(tsid) {
    this._tileSetCanvas.loadTileSet(tsid, data => {
      this.tileSetLoaded(tsid, data)
    });
  },

  tileSetLoaded: function(tsid, data) {
    if (data.tileSet) {
      this.closeModal();
      this.setState({
        tileSetId: data.tileSet.getId(),
        loadError: null
      });
      return;
    }
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      var info = data.status ? data.status + ": " + data.err : data.err;
      this.setState({
        loadError: "Could not load tileset " + tsid + " [" + info + "]",
      });
      return;
    }
    console.log("Something went wrong...");
  },

  loadTileSetsFromServer: function(event) {
    var tileSetService = new TileSetService();
    tileSetService.loadTileSets(this.tileSetsLoaded);
  },

  tileSetsLoaded: function(data) {
    if (data.tileSets) {
      this.setState({
        tileSets: data.tileSets,
        loadError: null,
        showModal: true
      });
      return;
    }
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      this.setState({
        tileSets: [],
        loadError: "Could not load tilesets [" + data.status + ": " + data.err + "]",
        showModal: true
      });
      return;
    }
    console.log("Something went wrong...");
  },

  updateCurrentTile: function(tilePosition, tile) {
    this.setState({ currentTilePosition: tilePosition, currentTile: tile});
  },

  render: function() {
    return (
      <div>
        <Panel className="component">
          <TileSetToolbar
              onLoadTileSetsFromServer={this.loadTileSetsFromServer} />
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
            error={this.state.loadError} />
      </div>
    );
  }
});

/* =============================================================================
 * COMPONENT: TILE SET TOOLBAR
 * =============================================================================
 */
function TileSetToolbar(props) {
  return (
    <ButtonToolbar>
      <Button onClick={props.onLoadTileSetsFromServer}>
        Open Tileset
      </Button>
    </ButtonToolbar>
  );
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
 * COMPONENT: TILE SET CANVAS
 * =============================================================================
 */
const TileSetCanvas = React.createClass({
  mixins: [tilePositionMixin],

  _tileSet: null,
  _canvas: null,

  getInitialState: function() {
    return {
      showTileset: false,
    };
  },

  loadTileSet: function(tilesetId, callback) {
    var tileSetService = new TileSetService();
    tileSetService.loadTileSet(tilesetId, data => {
      this.tileSetLoaded(data, callback);
    });
  },

  tileSetLoaded: function(data, callback) {
    if (data.tileSet) {
      this._tileSet = data.tileSet;
      this.drawTileSet();
      this.setState({ showTileset: true });
    }
    callback(data);
  },

  drawTileSet: function() {
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

  unhighlightTile: function(x, y, previousTile) {
    if (previousTile) {
      var ctx = this._canvas.getContext('2d');
      ctx.putImageData(previousTile.getImage(), x * tileSize, y * tileSize);
    }
  },

  highlightTile: function(x, y, currentTile) {
    if (currentTile) {
      var ctx = this._canvas.getContext('2d');
      ctx.drawImage(tileHighlight, x * tileSize, y * tileSize)
    }
  },

  handleMouseMove: function(evt) {
    var tilePosition = this.getCurrentTilePosition(evt);
    if (this.props.tilePosition &&
        tilePosition.x == this.props.tilePosition.x &&
        tilePosition.y == this.props.tilePosition.y) {
      return;
    }
    var tile = this._tileSet.getTile([tilePosition.x], [tilePosition.y]);
    this.props.onTilePositionUpdated(tilePosition, tile);
  },

  handleMouseOut: function() {
    this.props.onTilePositionUpdated();
  },

  handleMouseClick: function() {
    if (this.props.tile) {
      console.log("tile selected: " + this.props.tile);
      this.props.onTileSelected(this.props.tile);
    }
  },

  suppress: function(evt) {
    evt.preventDefault();
  },

  componentDidUpdate: function(oldProps, oldState) {
    if (oldProps.tilePosition) {
      this.unhighlightTile(oldProps.tilePosition.x, oldProps.tilePosition.y, oldProps.tile);
    }
    if (this.props.tilePosition) {
      this.highlightTile(this.props.tilePosition.x, this.props.tilePosition.y, this.props.tile);
    }
  },

  render: function() {
    var bsClass = this.state.showTileset ? "show tiles" : "hidden";
    return (
      <div className="canvas-container">
        <canvas className={bsClass}
            onMouseMove={this.handleMouseMove}
            onMouseOut={this.handleMouseOut}
            onClick={this.handleMouseClick}
            onContextMenu={this.suppress}
            ref={cvs => this._canvas = cvs} />
      </div>
    );
  }
});

/* =============================================================================
 * COMPONENT: TILE INFO
 * =============================================================================
 */
function TileInfo(props) {
  if (props.tilePosition && props.tile) {
    return (<p className="no-margin">{props.tilePosition.x}, {props.tilePosition.y} :: {props.tile.getTileSetName()}:{props.tile.getTileName()}</p>);
  }
  return (<p className="no-margin">-</p>);
}

module.exports = TilePalette;
