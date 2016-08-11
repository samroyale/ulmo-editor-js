var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    MapCanvas = require('./map-canvas.jsx'),
    RpgMapService = require('./rpg-maps.js'),
    utils = require('../utils.js'),
    tileSize = require('../config.js').tileSize,
    loadImage = require('../utils.js').loadImage;

var Panel = Bootstrap.Panel,
    Modal = Bootstrap.Modal,
    Grid = Bootstrap.Grid,
    Row = Bootstrap.Row,
    Col = Bootstrap.Col,
    ButtonToolbar = Bootstrap.ButtonToolbar,
    ButtonGroup = Bootstrap.ButtonGroup,
    Button = Bootstrap.Button,
    DropdownButton = Bootstrap.DropdownButton,
    Dropdown = Bootstrap.Dropdown,
    MenuItem = Bootstrap.MenuItem,
    Collapse = Bootstrap.Collapse,
    Alert = Bootstrap.Alert,
    Form = Bootstrap.Form,
    FormGroup = Bootstrap.FormGroup,
    ControlLabel = Bootstrap.ControlLabel,
    FormControl = Bootstrap.FormControl;

const rpgMapService = new RpgMapService();

var insertSuffix = null;
loadImage("/img/insert-suffix.png", data => insertSuffix = data.img);
var addSuffix = null;
loadImage("/img/add-suffix.png", data => addSuffix = data.img);
var selectSuffix = null;
loadImage("/img/select-suffix.png", data => selectSuffix = data.img);

/* =============================================================================
 * COMPONENT: MAP EDITOR
 * =============================================================================
 */
const MapEditor = React.createClass({
  _mapCanvas: null,

  getInitialState: function() {
    return {
      showModal: false,
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
    this.setState({ showModal: null });
  },

  mapSelected: function(mid) {
    var p = this._mapCanvas.loadMap(mid);
    p.then(
      data => this.mapLoaded(mid, data, false),
      data => this.mapLoadErr(mid, data)
    );
  },

  newMap: function(event) {
    this.setState({ showModal: "NEW" });
  },

  newMapOfSize: function(rows, cols) {
    var p = this._mapCanvas.newMap(rows, cols);
    p.then(
      data => this.mapLoaded(null, data, true)
    );
  },

  resizeMap: function(event) {
    this.setState({ showModal: "RESIZE" });
  },

  resizeMapToSize: function(left, right, top, bottom) {
    var p = this._mapCanvas.resizeMap(left, right, top, bottom);
    p.then(
      data => this.mapLoaded(null, data, true)
    );
  },

  mapLoaded: function(mid, data, dirty) {
    if (data.map) {
      this.closeModal();
      this.setState({
        mapId: data.map.getId(),
        mapDirty: dirty,
        loadError: null
      });
    }
  },

  mapLoadErr: function(mid, data) {
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
    rpgMapService.loadMaps(this.mapsLoaded);
  },

  mapsLoaded: function(data) {
    if (data.maps) {
      this.setState({
        maps: data.maps,
        loadError: null,
        showModal: "OPEN"
      });
      return;
    }
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      this.setState({
        maps: [],
        loadError: "Could not load maps [" + data.status + ": " + data.err + "]",
        showModal: "OPEN"
      });
      return;
    }
    console.log("Something went wrong...");
  },

  showSaveModal: function() {
    this.setState({ showModal: "SAVE" });
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
              onResizeMap={this.resizeMap}
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
            showModal={this.state.showModal === "OPEN"}
            maps={this.state.maps}
            onMapSelected={this.mapSelected}
            onClose={this.closeModal}
            error={this.state.loadError} />

        <NewMapModal
            showModal={this.state.showModal === "NEW"}
            onNewMap={this.newMapOfSize}
            onClose={this.closeModal} />

        <ResizeMapModal
            showModal={this.state.showModal === "RESIZE"}
            onResizeMap={this.resizeMapToSize}
            onClose={this.closeModal} />

        <SaveAsModal
            showModal={this.state.showModal === "SAVE"}
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
      <Button onClick={props.onResizeMap}>
        Resize Map
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
      ctx.fillStyle = 'rgba(0, 255, 0, 1)';
      ctx.fillRect(0, 0, tileSize, tileSize);
      ctx.drawImage(this.props.selectedTile.getCanvas(), 0, 0);
      if (this.props.tileMode === "INSERT") {
        ctx.drawImage(insertSuffix, this._canvas.width - 12, this._canvas.height - 12);
        return;
      }
      if (this.props.tileMode === "ADD") {
        ctx.drawImage(addSuffix, this._canvas.width - 12, this._canvas.height - 12);
        return;
      }
      if (this.props.tileMode === "SELECT") {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.drawImage(selectSuffix, this._canvas.width - 12, this._canvas.height - 12);
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
          <canvas className="tile-button-cvs" width={tileSize + 2} height={tileSize + 2}
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
 * COMPONENT: RESIZE MAP MODAL
 * =============================================================================
 */
const ResizeMapModal = React.createClass({
  // allows negative numbers
  _regex: /[^0-9\-]/g,

  getInitialState: function() {
    return {
      leftVal: '',
      rightVal: '',
      topVal: '',
      bottomVal: ''
    };
  },

  handleLeftChange: function(event) {
    this.setState({ leftVal: event.target.value.replace(this._regex, '') });
  },

  handleRightChange: function(event) {
    this.setState({ rightVal: event.target.value.replace(this._regex, '') });
  },

  handleTopChange: function(event) {
    this.setState({ topVal: event.target.value.replace(this._regex, '') });
  },

  handleBottomChange: function(event) {
    this.setState({ bottomVal: event.target.value.replace(this._regex, '') });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.newMap();
  },

  resizeMap: function() {
    var vals = [this.state.leftVal, this.state.rightVal, this.state.topVal, this.state.bottomVal]
        .map(val => {
          var n = parseInt(val);
          return isNaN(n) ? 0 : n;
        }
    );
    if (vals.some(val => val !== 0)) {
      this.props.onResizeMap(vals[0], vals[1], vals[2], vals[3]);
    }
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose} dialogClassName="resize-map-modal">
        <Modal.Header closeButton>
          <Modal.Title>Resize Map</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Grid>
              <Row>
                <Col lgOffset={1} lg={2}>
                  <FormGroup controlId="topGroup">
                    <ControlLabel>Top</ControlLabel>
                    <FormControl type="text" placeholder="number"
                        value={this.state.topVal} onChange={this.handleTopChange} />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg={2}>
                  <FormGroup controlId="leftGroup">
                    <ControlLabel>Left</ControlLabel>
                    <FormControl type="text" placeholder="0-32"
                        value={this.state.leftVal} onChange={this.handleLeftChange} />
                  </FormGroup>
                </Col>
                <Col lg={2}>
                  <FormGroup controlId="rightGroup">
                    <ControlLabel>Right</ControlLabel>
                    <FormControl type="text" placeholder="0-32"
                        value={this.state.rightVal} onChange={this.handleRightChange} />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lgOffset={1} lg={2}>
                  <FormGroup controlId="bottomGroup">
                    <ControlLabel>Bottom</ControlLabel>
                    <FormControl type="text" placeholder="0-32"
                        value={this.state.bottomVal} onChange={this.handleBottomChange} />
                  </FormGroup>
                </Col>
              </Row>
            </Grid>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.resizeMap} bsStyle="primary">OK</Button>
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
