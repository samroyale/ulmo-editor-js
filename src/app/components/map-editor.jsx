var React = require('react');
var Bootstrap = require('react-bootstrap');
var RpgMaps = require('./rpg-maps.js');
var tilePositionMixin = require('./tile-position-mixin.js');
var tileSize = require('../config.js').tileSize;

var Panel = Bootstrap.Panel;
var Modal = Bootstrap.Modal;
var ButtonToolbar = Bootstrap.ButtonToolbar;
var Button = Bootstrap.Button;
var Input = Bootstrap.Input;
var ButtonInput = Bootstrap.ButtonInput;
var Collapse = Bootstrap.Collapse;
var Alert = Bootstrap.Alert;

var RpgMapService = RpgMaps.RpgMapService;
var MaskTile = RpgMaps.MaskTile;

/* =============================================================================
 * COMPONENT: MAP EDITOR
 * =============================================================================
 */
const MapEditor = React.createClass({
  _mapCanvas: null,

  getInitialState: function() {
    return {
      showLoadModal: false,
      showNewModal: false,
      showSaveModal: false,
      maps: [],
      mapId: null,
      saveError: null,
      currentTilePosition: null,
      currentTile: null
    };
  },

  closeModal: function() {
    this.setState({
      showLoadModal: false,
      showNewModal: false,
      showSaveModal: false
    });
  },

  loadMapsFromServer: function(event) {
    var rpgMapService = new RpgMapService();
    rpgMapService.loadMaps(this.mapsLoaded);
  },

  mapsLoaded: function(mapDefs) {
    this.setState({ maps: mapDefs, showLoadModal: true });
  },

  mapSelected: function(mid) {
    this._mapCanvas.loadMap(mid, this.mapLoaded)
  },

  newMap: function(event) {
    this.setState({ showNewModal: true });
  },

  newMapOfSize: function(rows, cols) {
    this._mapCanvas.newMap(rows, cols, this.mapLoaded);
  },

  mapLoaded: function(data) {
    // use typeof to distinguish between null and undefined - a null mapId is
    // used to indicate that a new map has been initialized
    if (typeof data.mapId) {
      this.closeModal();
      // this.setState({ mapId: data.mapId, loadError: null });
      this.setState({ mapId: data.mapId });
      return;
    }
    /*if (data.err) {
      // console.log("Error [" + data.err + "]");
      this.setState({ loadError: data.err });
      return;
    }*/
    console.log("Something went wrong...");
  },

  saveMap: function() {
    if (this.state.mapId) {
      this._mapCanvas.saveMap(this.mapSaved);
      return;
    }
    this.setState({ showSaveModal: true });
  },

  saveMapAs: function(mapName) {
    this._mapCanvas.saveMapAs(mapName, this.mapSaved);
  },

  mapSaved: function(data) {
    if (data.mapId) {
      // console.log("Map saved [" + data.mapName + "/" + data.mapId + "]");
      this.closeModal();
      this.setState({ mapId: data.mapId, saveError: null });
      return;
    }
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      this.setState({ saveError: data.err });
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
          <MapToolbar
              onLoadMapsFromServer={this.loadMapsFromServer}
              onNewMap={this.newMap}
              onSaveMap={this.saveMap} />
          <MapCanvas
              onTilePositionUpdated={this.updateCurrentTile}
              selectedTile={this.props.selectedTile}
              tilePosition={this.state.currentTilePosition}
              mapTile={this.state.currentTile}
              ref={comp => this._mapCanvas = comp} />
          <MapTileInfo
              tilePosition={this.state.currentTilePosition}
              mapTile={this.state.currentTile} />
        </Panel>

        <OpenMapModal
            showModal={this.state.showLoadModal}
            maps={this.state.maps}
            onMapSelected={this.mapSelected}
            onClose={this.closeModal} />

        <NewMapModal
            showModal={this.state.showNewModal}
            onNewMap={this.newMapOfSize}
            onClose={this.closeModal} />

        <SaveAsModal
            showModal={this.state.showSaveModal}
            onSaveAs={this.saveMapAs}
            onClose={this.closeModal}
            error={this.state.saveError} />
      </div>
    );
  }
});

/* =============================================================================
 * COMPONENT: MAP TOOLBAR
 * =============================================================================
 */
function MapToolbar(props) {
  return (
    <ButtonToolbar>
      <Button bsStyle="primary" onClick={props.onLoadMapsFromServer}>
        Open Map
      </Button>
      <Button bsStyle="primary" onClick={props.onNewMap}>
        New Map
      </Button>
      <Button bsStyle="primary" onClick={props.onSaveMap}>
        Save Map
      </Button>
    </ButtonToolbar>
  );
}

/* =============================================================================
 * COMPONENT: OPEN MAP MODAL
 * =============================================================================
 */
function OpenMapModal(props) {
  var items = props.maps.map(map => <MapItem key={map.id} map={map}
      onMapSelected={props.onMapSelected} />
  );

  return (
    <Modal show={props.showModal} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Choose Map</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>{items}</ul>
      </Modal.Body>
    </Modal>
  );
}

/* =============================================================================
 * COMPONENT: MAP ITEM
 * =============================================================================
 */
function MapItem(props) {
  return (<li><a href="#" onClick={function(event) {
    event.preventDefault();
    props.onMapSelected(props.map.id);
  }}>{props.map.name}</a></li>);
}

/* =============================================================================
 * COMPONENT: NEW MAP MODAL
 * =============================================================================
 */
const NewMapModal = React.createClass({
  _regex: /\D/g,

  getInitialState: function() {
    return {
      rowsVal: '',
      colsVal: ''
    };
  },

  handleRowsChange: function(event) {
    this.setState({ rowsVal: event.target.value.replace(this._regex, '') });
  },

  handleColsChange: function(event) {
    this.setState({ colsVal: event.target.value.replace(this._regex, '') });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var rows = parseInt(this.state.rowsVal, 10);
    var cols = parseInt(this.state.colsVal, 10);
    if (rows > 0 && cols > 0) {
      this.props.onNewMap(rows, cols);
    }
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Map</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={this.handleSubmit}>
          <Input type="text" label="Rows" placeholder="0-32" value={this.state.rowsVal} onChange={this.handleRowsChange} />
          <Input type="text" label="Cols" placeholder="0-32" value={this.state.colsVal} onChange={this.handleColsChange} />
          <ButtonInput type="submit" value="OK" />
        </form>
        </Modal.Body>
      </Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: SAVE AS MODAL
 * =============================================================================
 */
const SaveAsModal = React.createClass({
  _regex: /\W/g,

  getInitialState: function() {
    return {
      mapName: '',
    };
  },

  handleNameChange: function(event) {
    this.setState({ mapName: event.target.value.replace(this._regex, '') });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var mapName = this.state.mapName;
    if (mapName.length > 0) {
      this.props.onSaveAs(mapName);
    }
  },

  render: function() {
    var showError = this.props.error && this.props.error.length > 0;
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Save As</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={this.handleSubmit}>
          <Input type="text" label="Name" placeholder="map name" value={this.state.mapName} onChange={this.handleNameChange} />
          <Collapse in={showError}>
            <div>
              <Alert bsStyle="danger">{this.props.error}</Alert>
            </div>
          </Collapse>
          <ButtonInput type="submit" value="Save" />
        </form>
        </Modal.Body>
      </Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: MAP CANVAS
 * =============================================================================
 */
const MapCanvas = React.createClass({
  mixins: [tilePositionMixin],

  _rpgMap: null,
  _canvas: null,
  _highlight: null,

  getInitialState: function() {
    return {
      showMap: false,
    };
  },

  hideMap: function() {
    this.setState({ showMap: false });
  },

  loadMap: function(mapId, callback) {
    var rpgMapService = new RpgMapService();
    rpgMapService.loadMap(mapId, rpgMap => {
      this._rpgMap = rpgMap;
      this.drawMap();
      this.setState({ showMap: true });
      callback({ mapId });
    });
  },

  newMap: function(rows, cols, callback) {
    var rpgMapService = new RpgMapService();
    rpgMapService.newMap(rows, cols, rpgMap => {
      this._rpgMap = rpgMap;
      this.drawMap();
      this.setState({ showMap: true });
      callback({ mapId: null });
    });
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
    var tile = this._rpgMap.getMapTile(tilePosition.x, tilePosition.y);
    this.props.onTilePositionUpdated(tilePosition, tile);
  },

  handleMouseOut: function() {
    this.props.onTilePositionUpdated();
  },

  handleMouseClick: function() {
    if (!this.props.selectedTile) {
      return;
    }
    if (!this.props.mapTile) {
      return;
    }
    this.props.mapTile.addMaskTile(new MaskTile(this.props.selectedTile));
    this.props.onTilePositionUpdated(this.props.tilePosition, this.props.mapTile);
  },

  componentDidMount: function() {
    this._highlight = this.initTileHighlight();
  },

  componentDidUpdate: function(oldProps, oldState) {
    if (oldProps.tilePosition) {
      this.unhighlightTile(oldProps.tilePosition.x, oldProps.tilePosition.y, oldProps.mapTile);
    }
    if (this.props.tilePosition) {
      this.highlightTile(this.props.tilePosition.x, this.props.tilePosition.y, this.props.mapTile);
    }
  },

  render: function() {
    var bsClass = this.state.showMap ? "show" : "hidden";
    return (
      <div className="canvas-container">
        <canvas className={bsClass}
            onMouseMove={this.handleMouseMove}
            onMouseOut={this.handleMouseOut}
            onClick={this.handleMouseClick}
            ref={cvs => this._canvas = cvs} />
      </div>
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

module.exports = MapEditor;
