var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    RpgMaps = require('./rpg-maps.js'),
    tilePositionMixin = require('./tile-position-mixin.js'),
    tileSize = require('../config.js').tileSize;

var Panel = Bootstrap.Panel,
    Modal = Bootstrap.Modal,
    ButtonToolbar = Bootstrap.ButtonToolbar,
    ButtonGroup = Bootstrap.ButtonGroup,
    Button = Bootstrap.Button,
    Input = Bootstrap.Input,
    ButtonInput = Bootstrap.ButtonInput,
    Collapse = Bootstrap.Collapse,
    Overlay = Bootstrap.Overlay,
    Popover = Bootstrap.Popover,
    MenuItem = Bootstrap.MenuItem,
    Alert = Bootstrap.Alert,
    DropdownButton = Bootstrap.DropdownButton;

var RpgMapService = RpgMaps.RpgMapService,
    MaskTile = RpgMaps.MaskTile;

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
      loadError: null,
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

  mapSelected: function(mid) {
    this._mapCanvas.loadMap(mid, data => {
      this.mapLoaded(mid, data)
    });
  },

  newMap: function(event) {
    this.setState({ showNewModal: true });
  },

  newMapOfSize: function(rows, cols) {
    this._mapCanvas.newMap(rows, cols, data => {
      this.mapLoaded(null, data)
    });
  },

  mapLoaded: function(mid, data) {
    if (data.map) {
      this.closeModal();
      this.setState({
        mapId: data.map.getId(),
        loadError: null
      });
      return;
    }
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      var info = data.status ? data.status + ": " + data.err : data.err;
      this.setState({
        loadError: "Could not load map " + mid + " [" + info + "]",
      });
      return;
    }
    console.log("Something went wrong...");
  },

  loadMapsFromServer: function(event) {
    var rpgMapService = new RpgMapService();
    rpgMapService.loadMaps(this.mapsLoaded);
  },

  mapsLoaded: function(data) {
    if (data.maps) {
      this.setState({
        maps: data.maps,
        loadError: null,
        showLoadModal: true
      });
      return;
    }
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      this.setState({
        maps: [],
        loadError: "Could not load maps [" + data.status + ": " + data.err + "]",
        showLoadModal: true
      });
      return;
    }
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
              ref={comp => this._mapCanvas = comp} />
          <MapTileInfo
              tilePosition={this.state.currentTilePosition}
              mapTile={this.state.currentTile} />
        </Panel>

        <OpenMapModal
            showModal={this.state.showLoadModal}
            maps={this.state.maps}
            onMapSelected={this.mapSelected}
            onClose={this.closeModal}
            error={this.state.loadError} />

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
  var showError = props.error && props.error.length > 0;
  var items = props.maps.map(
    map => <MapItem key={map.id} map={map}
        onMapSelected={props.onMapSelected} />
  );

  return (
    <Modal show={props.showModal} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Maps</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Collapse in={showError}>
          <div>
            <Alert bsStyle="danger">{props.error}</Alert>
          </div>
        </Collapse>
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
        <Collapse in={showError}>
          <div>
            <Alert bsStyle="warning">{this.props.error}</Alert>
          </div>
        </Collapse>
        <form onSubmit={this.handleSubmit}>
          <Input type="text" label="Name" placeholder="map name" value={this.state.mapName} onChange={this.handleNameChange} />
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

  _startPosition: null,
  _mouseDown: null,

  getInitialState: function() {
    return {
      showMap: false,
      showOverlay: false,
      overlayPosition: {x: 0, y: 0}
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

  unhighlightRange(fromPosition, toPosition) {
    this.processRange(fromPosition, toPosition, (x, y, cols, rows, ctx) => {
      for (var i = x; i < x + cols; i++) {
        for (var j = y; j < y + rows; j++) {
          ctx.putImageData(this._rpgMap.getMapTile(i, j).getImage(), i * tileSize, j * tileSize);
        }
      }
    });
  },

  highlightRange(fromPosition, toPosition) {
    this.processRange(fromPosition, toPosition, (x, y, cols, rows, ctx) => {
      var highlight = this.initHighlight(rows, cols);
      ctx.drawImage(highlight, x * tileSize, y * tileSize);
    });
  },

  applySelectedTile(fromPosition, toPosition) {
    this.processRange(fromPosition, toPosition, (x, y, cols, rows, ctx) => {
      for (var i = x; i < x + cols; i++) {
        for (var j = y; j < y + rows; j++) {
          var mapTile = this._rpgMap.getMapTile(i, j);
          mapTile.addMaskTile(new MaskTile(this.props.selectedTile));
          ctx.putImageData(mapTile.getImage(), i * tileSize, j * tileSize);
        }
      }
    });
    this.setState({ updated: true });
  },

  processRange(fromPosition, toPosition, func) {
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
    if (this.state.startPosition) {
      this.applySelectedTile(this.state.startPosition, this.props.tilePosition);
    }
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
    console.log("hide overlay!")
    this.setState({ showOverlay: false });
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
            show={this.state.showOverlay}
            position={this.state.overlayPosition}
            onHide={this.hideOverlay} />
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

  onSelectAlert: function() {
    alert("OMG");
  },

  render: function() {
    console.log(this.props.position.x +"," + this.props.position.y);
    var style = {
      position: 'absolute',
      backgroundColor: '#EEE',
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
      border: '1px solid #CCC',
      marginLeft: this.props.position.x,
      marginTop: this.props.position.y,
      borderRadius: 4,
      padding: 8
    };
    return (
      <Overlay
        show={this.props.show}
        rootClose={true}
        onHide={this.props.onHide}>
        <div style={style} onContextMenu={this.suppress}>
        <ButtonGroup vertical>
            <Button>Button</Button>
            <Button>Button</Button>
            <DropdownButton title="Dropdown" id="bg-vertical-dropdown-1">
              <MenuItem eventKey="1">Dropdown link</MenuItem>
              <MenuItem eventKey="2">Dropdown link</MenuItem>
            </DropdownButton>
            <Button>Button</Button>
            <Button>Button</Button>
            <DropdownButton title="Dropdown" id="bg-vertical-dropdown-2">
              <MenuItem eventKey="1">Dropdown link</MenuItem>
              <MenuItem eventKey="2">Dropdown link</MenuItem>
            </DropdownButton>
            <DropdownButton title="Dropdown" id="bg-vertical-dropdown-3">
              <MenuItem eventKey="1">Dropdown link</MenuItem>
              <MenuItem eventKey="2">Dropdown link</MenuItem>
            </DropdownButton>
          </ButtonGroup>
        </div>
      </Overlay>
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
