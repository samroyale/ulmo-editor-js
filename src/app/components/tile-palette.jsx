var React = require('react');
var Bootstrap = require('react-bootstrap');
var TileSets = require('./tile-sets.js');
var tilePositionMixin = require('./tile-position-mixin.js');
var tileSize = require('../config.js').tileSize;

var Panel = Bootstrap.Panel;
var Modal = Bootstrap.Modal;
var ButtonToolbar = Bootstrap.ButtonToolbar;
var Button = Bootstrap.Button;

var TileSetService = TileSets.TileSetService;

/* =============================================================================
 * COMPONENT: TILE PALETTE
 * =============================================================================
 */
const TilePalette = React.createClass({
  _tilesetCanvas: null,

  getInitialState: function() {
    return {
      showModal: false,
      tileSets: [],
      tileSetId: null,
      currentTilePosition: null,
      currentTile: null
    };
  },

  closeModal: function() {
    this.setState({ showModal: false });
  },

  tileSetSelected: function(tsid) {
    this.closeModal();
    if (tsid.length == 0) {
      this._tilesetCanvas.hideTileSet();
      return;
    }
    this._tilesetCanvas.loadTileSet(tsid);
  },

  tileSetsLoaded: function(tileSetDefs) {
    this.setState({ tileSets: tileSetDefs, showModal: true });
  },

  loadTileSetsFromServer: function(event) {
    var tileSetService = new TileSetService();
    tileSetService.loadTileSets(this.tileSetsLoaded);
  },

  updateCurrentTile: function(tilePosition, tile) {
    this.setState({ currentTilePosition: tilePosition, currentTile: tile});
  },

  render: function() {
    return (
      <div>
        <Panel>
          <TileSetToolbar
              onLoadTileSetsFromServer={this.loadTileSetsFromServer} />
          <TileSetCanvas
              onTileSelected={this.props.onTileSelected}
              onTilePositionUpdated={this.updateCurrentTile}
              tilePosition={this.state.currentTilePosition}
              tile={this.state.currentTile}
              ref={comp => this._tilesetCanvas = comp} />
          <TileInfo
              tilePosition={this.state.currentTilePosition}
              tile={this.state.currentTile} />
        </Panel>

        <OpenTileSetModal
            showModal={this.state.showModal}
            tileSets={this.state.tileSets}
            onTileSetSelected={this.tileSetSelected}
            onClose={this.closeModal} />
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
      <Button bsStyle="primary" onClick={props.onLoadTileSetsFromServer}>
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
  var items = props.tileSets.map(
    tileSet => <TileSetItem key={tileSet.id} tileSet={tileSet}
        onTileSetSelected={props.onTileSetSelected} />
  );

  return (
    <Modal show={props.showModal} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tilesets</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>{items}</ul>
      </Modal.Body>
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
  _highlight: null,

  getDefaultProps: function() {
    return {
      divStyle: { padding: "10px 0" },
      cvsStyle: { backgroundColor: "#00FF00" }
    };
  },

  getInitialState: function() {
    return {
      showTileset: false,
    };
  },

  hideTileSet: function() {
    this.setState({ showTileset: false });
  },

  loadTileSet: function(tilesetId) {
    var tileSetService = new TileSetService();
    tileSetService.loadTileSet(tilesetId, tileSet => {
      this._tileSet = tileSet;
      this.drawTileSet();
      this.setState({ showTileset: true });
    });
  },

  initEmptyTile: function() {
    var emptyCanvas = document.createElement("canvas");
    emptyCanvas.width = tileSize;
    emptyCanvas.height = tileSize;
    var ctx = emptyCanvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, tileSize, tileSize);
    return emptyCanvas;
  },

  drawTileSet: function() {
    var cols = this._tileSet.getCols();
    var rows = this._tileSet.getRows();
    this._canvas.width = cols * tileSize;
    this._canvas.height = rows * tileSize;
    var ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    var emptyTile = this.initEmptyTile();
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
      ctx.drawImage(this._highlight, x * tileSize, y * tileSize)
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

  componentDidMount: function() {
    // this._canvas = ReactDOM.findDOMNode(this.refs.cvs);
    this._highlight = this.initTileHighlight();
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
    var bsClass = this.state.showTileset ? "show" : "hidden";
    return (
      <div style={this.props.divStyle}>
        <canvas className={bsClass} style={this.props.cvsStyle}
            onMouseMove={this.handleMouseMove}
            onMouseOut={this.handleMouseOut}
            onClick={this.handleMouseClick}
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
    return (<p>{props.tilePosition.x}, {props.tilePosition.y} :: {props.tile.getTileSetName()}:{props.tile.getTileName()}</p>);
  }
  return (<p>-</p>);
}

module.exports = TilePalette;
