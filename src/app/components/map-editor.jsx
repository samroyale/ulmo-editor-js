var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    RpgMapService = require('./rpg-maps.js'),
    MapCanvas = require('./map-canvas.jsx'),
    utils = require('../utils.js'),
    tileSize = require('../config.js').tileSize,
    initAddSuffix = require('../utils.js').initAddSuffix;

var Panel = Bootstrap.Panel,
    Modal = Bootstrap.Modal,
    ButtonToolbar = Bootstrap.ButtonToolbar,
    ButtonGroup = Bootstrap.ButtonGroup,
    Button = Bootstrap.Button,
    DropdownButton = Bootstrap.DropdownButton,
    Dropdown = Bootstrap.Dropdown,
    MenuItem = Bootstrap.MenuItem,
    Collapse = Bootstrap.Collapse,
    Alert = Bootstrap.Alert,
    FormGroup = Bootstrap.FormGroup,
    ControlLabel = Bootstrap.ControlLabel,
    FormControl = Bootstrap.FormControl;

const addSuffix = initAddSuffix();

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
      mapDirty: false,
      maps: [],
      mapId: null,
      loadError: null,
      saveError: null,
      currentTilePosition: null,
      currentTile: null,
      tileMode: null
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
      var dirty = mid ? false : true; // true for new maps
      this.closeModal();
      this.setState({
        mapId: data.map.getId(),
        mapDirty: dirty,
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

  showSaveModal: function() {
    this.setState({ showSaveModal: true });
  },

  saveMap: function() {
    if (this.state.mapId) {
      this._mapCanvas.saveMap(this.mapSaved);
      return;
    }
    this.showSaveModal();
  },

  saveMapAs: function(mapName) {
    this._mapCanvas.saveMapAs(mapName, this.mapSaved);
  },

  mapSaved: function(data) {
    if (data.mapId) {
      // console.log("Map saved [" + data.mapName + "/" + data.mapId + "]");
      this.closeModal();
      this.setState({
        mapId: data.mapId,
        mapDirty: false,
        saveError: null,
      });
      return;
    }
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      this.setState({ saveError: data.err });
      return;
    }
    console.log("Something went wrong...");
  },

  mapUpdated: function() {
    this.setState({ mapDirty: true });
  },

  updateCurrentTile: function(tilePosition, tile) {
    this.setState({ currentTilePosition: tilePosition, currentTile: tile});
  },

  setTileControlMode: function(mode) {
    this.setState({ tileMode: mode });
  },

  componentWillReceiveProps: function(nextProps) {
    // if selecting a tile for the first time, set the tile mode to INSERT
    if (!this.props.selectedTile && nextProps.selectedTile) {
      this.setState({ tileMode: "INSERT" });
    }
  },

  render: function() {
    return (
      <div>
        <Panel className="component">
          <MapToolbar
              selectedTile={this.props.selectedTile}
              tileMode={this.state.tileMode}
              mapDirty={this.state.mapDirty}
              onLoadMapsFromServer={this.loadMapsFromServer}
              onNewMap={this.newMap}
              onSaveMap={this.saveMap}
              onShowSaveModal={this.showSaveModal}
              onModeChange={this.setTileControlMode} />
          <MapCanvas
              selectedTile={this.props.selectedTile}
              tileMode={this.state.tileMode}
              tilePosition={this.state.currentTilePosition}
              onTilePositionUpdated={this.updateCurrentTile}
              onMapUpdated={this.mapUpdated}
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
      <TileControl
          selectedTile={props.selectedTile}
          tileMode={props.tileMode}
          onModeChange={props.onModeChange} />
      <Button onClick={props.onLoadMapsFromServer}>
        Open Map
      </Button>
      <Button onClick={props.onNewMap}>
        New Map
      </Button>
      <DropdownButton title="Save" id="Save">
        <MenuItem onClick={props.onSaveMap} disabled={!props.mapDirty}>Save</MenuItem>
        <MenuItem onClick={props.onShowSaveModal}>Save as</MenuItem>
      </DropdownButton>
    </ButtonToolbar>
  );
}

/* =============================================================================
 * COMPONENT: TILE CONTROL
 * =============================================================================
 */
const TileControl = React.createClass({
  _canvas: null,

  getInitialState: function() {
    return {
      disabled: true
    };
  },

  /*setMode: function(mode) {
    this.props.onModeChange(mode);
  },*/

  /*componentWillMount: function() {
    this.populateStateFromProps(this.props);
  },*/

  componentWillReceiveProps: function(nextProps) {
    // if selecting a tile for the first time, set the tile mode to INSERT
    if (nextProps.tileMode) {
      this.setState({ disabled: false });
    }
  },

  componentDidUpdate: function(oldProps, oldState) {
    if (this.props.selectedTile) {
      var ctx = utils.getScalableDrawingContext(this._canvas);
      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      ctx.drawImage(this.props.selectedTile.getCanvas(), 0, 0);
      if (this.props.tileMode === "ADD") {
        ctx.drawImage(addSuffix, this._canvas.width - 10, this._canvas.height - 10);
        return;
      }
      if (this.props.tileMode === "SELECT") {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
      }
    }
  },

  menuItem: function(mode, label) {
    var active = (mode === this.props.tileMode);
    return (<MenuItem eventKey={mode} active={active}>{label}</MenuItem>);
  },

  render: function() {
    return (
      <Dropdown id="tile-control-dropdown" onSelect={this.props.onModeChange} disabled={this.state.disabled}>
        <Button className="tile-button">
          <canvas className="tiles" width={tileSize} height={tileSize}
              ref={cvs => this._canvas = cvs} />
        </Button>
        <Dropdown.Toggle className="tile-dropdown" />
        <Dropdown.Menu>
          {this.menuItem("INSERT", "Insert")}
          {this.menuItem("ADD", "Add")}
          {this.menuItem("SELECT", "Select")}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
});

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
        <Modal.Title>Open Map</Modal.Title>
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
    console.log("submitted");
    e.preventDefault();
    this.newMap();
  },

  newMap: function() {
    var rows = parseInt(this.state.rowsVal, 10);
    var cols = parseInt(this.state.colsVal, 10);
    if (rows > 0 && cols > 0) {
      this.props.onNewMap(rows, cols);
    }
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose} bsSize="small">
        <Modal.Header closeButton>
          <Modal.Title>New Map</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="rowsGroup">
              <ControlLabel>Rows</ControlLabel>
              <FormControl type="text" placeholder="0-32"
                  value={this.state.rowsVal} onChange={this.handleRowsChange} />
            </FormGroup>
            <FormGroup controlId="colsGroup">
              <ControlLabel>Cols</ControlLabel>
              <FormControl type="text" placeholder="0-32"
                  value={this.state.colsVal} onChange={this.handleColsChange} />
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.newMap} bsStyle="primary">OK</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Footer>
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
    this.saveMap();
  },

  saveMap: function() {
    var mapName = this.state.mapName;
    if (mapName.length > 0) {
      this.props.onSaveAs(mapName);
    }
  },

  render: function() {
    var showError = this.props.error && this.props.error.length > 0;
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose} bsSize="small">
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
            <FormGroup controlId="nameGroup">
              <ControlLabel>Name</ControlLabel>
              <FormControl type="text" placeholder="map name"
                  value={this.state.mapName} onChange={this.handleNameChange} />
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.saveMap} bsStyle="primary">OK</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
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
    var masks = props.mapTile.getMaskTiles().filter(maskTile => {
      return maskTile.getMaskLevel() ? true : false;
    }).map( maskTile => {
      return maskTile.getMaskLevel();
    });
    var masksInfo = "[" + masks.toString() + "]";
    return (
      <p className="no-margin">
        {props.tilePosition.x}, {props.tilePosition.y} :: {props.mapTile.getMaskTiles().length} {levelsInfo} {masksInfo}
      </p>
    );
  }
  return (<p className="no-margin">-</p>);
}

module.exports = MapEditor;
