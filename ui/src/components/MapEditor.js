import React from 'react';
import { Panel, Modal, Grid, Row, Col, ButtonToolbar, Button, DropdownButton,
    Dropdown, MenuItem, Collapse, Alert, Form, FormGroup, FormControl, ControlLabel,
    ProgressBar, Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';
import SpritesModal from './SpritesModal';
import MapCanvas from './MapCanvas';
import RpgMapService from '../services/RpgMaps';
import { tileSize } from '../config';
import { initRect, getDrawingContext } from '../utils';
import './MapEditor.css';

const rpgMapService = new RpgMapService();

const whiteSquare = initRect('white', 9, 9);

/* =============================================================================
 * COMPONENT: MAP EDITOR
 * =============================================================================
 */
class MapEditor extends React.Component {
  constructor(props) {
    super(props);
    this._mapCanvas = React.createRef();
    this.state = {
      showModal: null,
      showProgressModal: false,
      showWarningModal: false,
      showErrorModal: false,
      errorModalTitle: null,
      progressTitle: null,
      progressPercent: 0,
      continue: null,
      mapDirty: false,
      maps: [],
      mapId: null,
      sprites: [],
      serviceError: null,
      currentTilePosition: null,
      currentTile: null,
      tileMode: null,
      changeHistory: []
    };
  }

  closeModal = () => {
    this.setState({
      showModal: null,
      showProgressModal: false,
      serviceError: null
    });
  };

  showProgressModal = title => {
    this.setState({
      showProgressModal: true,
      progressTitle: title,
      progressPercent: 0
    });
  };

  updateProgress = percent => this.setState({ progressPercent: percent });

  closeProgressModal = () => this.setState({ showProgressModal: false });

  closeErrorModal = () => {
    this.setState({
      serviceError: null,
      showErrorModal: false
    });
  };

  showWarningModal = callback => {
    this.setState({
      showWarningModal: true,
      continue: callback
    });
  };

  closeWarningModal = ()  => this.setState({ showWarningModal: false });

  mapSelected = mid => {
    if (this.state.mapDirty) {
      this.showWarningModal(() =>
        this.continueMapSelected(mid)
      );
      return;
    }
    this.continueMapSelected(mid);
  };

  continueMapSelected = async mid => {
    this.showProgressModal("Loading map...");
    try {
      var data = await this._mapCanvas.current.loadMap(mid);
      this.mapLoaded(data, false);
    }
    catch(e) {
      this.mapLoadErr(e);
    }
  };

  newMap = evt => this.setState({ showModal: "NEW" });

  newMapOfSize = (rows, cols) => {
    if (this.state.mapDirty) {
      this.showWarningModal(() =>
        this.continueNewMapOfSize(rows, cols)
      );
      return;
    }
    this.continueNewMapOfSize(rows, cols);
  };

  continueNewMapOfSize = (rows, cols) => {
    var data = this._mapCanvas.current.newMap(rows, cols);
    this.mapLoaded(data, true);
  };

  resizeMap = evt => {
    if (this.isMapPresent()) {
      this.setState({ showModal: "RESIZE" });
    }
  };

  resizeMapToSize = (left, right, top, bottom) => {
    var data = this._mapCanvas.current.resizeMap(left, right, top, bottom);
    this.mapLoaded(data, true);
  };

  mapLoaded = ({ map, oldMap }, dirty) => {
    if (map) {
      console.log("map loaded: " + map.getId());
      this.closeModal();
      this.setState({
        mapId: map.getId(),
        mapDirty: dirty,
        serviceError: null
      });
    }
    // oldMap is present only on resize
    if (oldMap) {
      this.addToChangeHistory({ map: oldMap });
      return;
    }
    this.setState({ changeHistory: [] });
  };

  mapLoadErr = ({ message }) => {
    if (message) {
      this.setState({
        showProgressModal: false,
        serviceError: message
      });
      return;
    }
    console.log("Something went wrong...");
  };

  loadMapsFromServer = async evt => {
    try {
      var { maps } = await rpgMapService.loadMaps();
      this.setState({
        maps: maps,
        serviceError: null,
        showModal: "OPEN"
      });
    }
    catch(e) {
      this.mapsLoadErr(e);
    }
  };

  mapsLoadErr = ({ message }) => {
    if (message) {
      this.setState({
        maps: [],
        serviceError: message,
        showErrorModal: true,
        errorModalTitle: "Open Map"
      });
      return;
    }
    console.log("Something went wrong...");
  };

  showSaveModal = () => {
    if (this.isMapPresent()) {
      this.setState({ showModal: "SAVE" });
    }
  };

  isMapPresent = () => {
    // a mapId of undefined or something indicates that we have a map, whereas null indicates that we don't
    return this.state.mapId !== null;
  };

  saveMap = async () => {
    if (!this.state.mapId) {
      this.showSaveModal();
      return;
    }
    try {
      var data = await this._mapCanvas.current.saveMap();
      this.mapSaved(data);
    }
    catch(e) {
      this.mapSaveErr(e);
    }
  };

  saveMapAs = async (mapName) => {
    try {
      var data = await this._mapCanvas.current.saveMapAs(mapName);
      this.mapSaved(data);
    }
    catch(e) {
      this.mapSaveErr(e);
    }
  };

  mapSaved = ({ mapId }) => {
    if (mapId) {
      // console.log("Map saved [" + data.mapName + "/" + data.mapId + "]");
      this.closeModal();
      this.setState({
        mapId: mapId,
        mapDirty: false,
        serviceError: null
      });
    }
  };

  mapSaveErr = ({ message }) => {
    if (message) {
      this.setState({
        serviceError: message
      });
      if (this.state.showModal !== "SAVE") {
        this.setState({
          showErrorModal: true,
          errorModalTitle: "Save Map"
        });
      }
      return;
    }
    console.log("Something went wrong...");
  };

  mapUpdated = (topLeft, oldTiles) => {
    this.setState({ mapDirty: true });
    if (!topLeft || !oldTiles) {
      return;
    }
    this.addToChangeHistory({
      topLeft: topLeft,
      tiles: oldTiles
    });
  };

  addToChangeHistory = item => {
    var history = this.state.changeHistory;
    history.push(item);
    this.setState( { changeHistory: history });
  };

  undo = () => {
    var history = this.state.changeHistory;
    var lastChange = history.pop();
    this.setState( { changeHistory: history });
    const mapCanvas = this._mapCanvas.current;
    if (lastChange.topLeft) {
      mapCanvas.restoreTiles(lastChange.topLeft, lastChange.tiles);
      return;
    }
    if (lastChange.map) {
      mapCanvas.restoreMap(lastChange.map);
      return;
    }
    if (lastChange.sprites) {
      mapCanvas.restoreSprites(lastChange.sprites);
      return;
    }
    console.log("Could not undo [unknown change]");
  };

  updateCurrentTile = (tilePosition, tile) => {
    this.setState({
      currentTilePosition: tilePosition,
      currentTile: tile
    });
  };

  setTileControlMode = mode => this.setState({ tileMode: mode });

  editSprites = () => {
    if (this.isMapPresent()) {
      this.setState({
        showModal: "SPRITES",
        sprites: this._mapCanvas.current.getSpritesFromMap()
      });
    }
  };

  applySpritesEdit = newSprites => {
    this.closeModal();
    var oldSprites = this._mapCanvas.current.applySpritesEdit(newSprites);
    this.mapUpdated();
    this.addToChangeHistory({ sprites: oldSprites })
  };

  static getDerivedStateFromProps = ({ selectedTile }, { tileMode }) => {
    // if selecting a tile for the first time, set the tile mode to INSERT
    if (!tileMode && selectedTile) {
      return { tileMode: "INSERT" };
    }
    return null;
  };

  render = () => {
    const { selectedTile, onAdmin } = this.props;
    return (
      <div>
        <Panel className="component" bsClass="component-panel">
          <MapToolbar
              selectedTile={selectedTile}
              tileMode={this.state.tileMode}
              mapDirty={this.state.mapDirty}
              mapPresent={this.state.mapId !== null}
              onLoadMapsFromServer={this.loadMapsFromServer}
              onNewMap={this.newMap}
              onResizeMap={this.resizeMap}
              onSaveMap={this.saveMap}
              onShowSaveModal={this.showSaveModal}
              onModeChange={this.setTileControlMode}
              onEditSprites={this.editSprites}
              onUndo={this.undo}
              noHistory={this.state.changeHistory.length === 0}
              onAdmin={onAdmin} />
          <MapCanvas
              selectedTile={selectedTile}
              tileMode={this.state.tileMode}
              tilePosition={this.state.currentTilePosition}
              onTilePositionUpdated={this.updateCurrentTile}
              onMapUpdated={this.mapUpdated}
              ref={this._mapCanvas} />
          <MapTileInfo
              tilePosition={this.state.currentTilePosition}
              mapTile={this.state.currentTile} />
        </Panel>

        <OpenMapModal
            showModal={this.state.showModal === "OPEN"}
            maps={this.state.maps}
            onMapSelected={this.mapSelected}
            onClose={this.closeModal}
            error={this.state.serviceError} />

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
            error={this.state.serviceError} />

        <SpritesModal
            showModal={this.state.showModal === "SPRITES"}
            sprites={this.state.sprites}
            onSubmit={this.applySpritesEdit}
            onClose={this.closeModal} />

        <ProgressModal
            showModal={this.state.showProgressModal}
            title={this.state.progressTitle}
            percent={this.state.progressPercent} />

        <WarningModal
            showModal={this.state.showWarningModal}
            onContinue={this.state.continue}
            onClose={this.closeWarningModal} />

        <ErrorModal
            showModal={this.state.showErrorModal}
            title={this.state.errorModalTitle}
            error={this.state.serviceError}
            onClose={this.closeErrorModal} />
      </div>
    );
  };
}

/* =============================================================================
 * COMPONENT: MAP TOOLBAR
 * =============================================================================
 */
const MapToolbar = ({
  selectedTile,
  tileMode,
  onModeChange,
  onLoadMapsFromServer,
  onNewMap,
  onResizeMap,
  mapPresent,
  onSaveMap,
  mapDirty,
  onShowSaveModal,
  onExport,
  onEditSprites,
  onUndo,
  noHistory
  }) => (
  <ButtonToolbar className="component-buttons">
    <TileControl
      selectedTile={selectedTile}
      tileMode={tileMode}
      onModeChange={onModeChange} />
    <Button onClick={onLoadMapsFromServer}>Open</Button>
    <Button onClick={onNewMap}>New</Button>
    <Button onClick={onResizeMap} disabled={!mapPresent}>Resize</Button>
    <DropdownButton title="File" id="file" disabled={!mapPresent}>
      <MenuItem onClick={onSaveMap} disabled={!mapDirty}>Save</MenuItem>
      <MenuItem onClick={onShowSaveModal}>Save as</MenuItem>
      <MenuItem onClick={onExport}>Export</MenuItem>
    </DropdownButton>
    <Button onClick={onEditSprites} disabled={!mapPresent}>Sprites</Button>
    <Button onClick={onUndo} disabled={noHistory}>
      <div className="reverse"><Glyphicon glyph="repeat" /></div>
    </Button>
    { /*<Button bsStyle="link" onClick={onAdmin}>Admin</Button>*/ }
  </ButtonToolbar>
);

/* =============================================================================
 * COMPONENT: TILE CONTROL
 * =============================================================================
 */
class TileControl extends React.Component {
  constructor(props) {
    super(props);
    this._canvas = React.createRef();
    this.state = {
      disabled: true
    };
  }

  static getDerivedStateFromProps = ({ tileMode }, { disabled }) => {
    if (disabled && tileMode) {
      return { disabled: false };
    }
    return null;
  };

  componentDidUpdate = () => {
    const { selectedTile, tileMode } = this.props;
    if (selectedTile) {
      const canvas = this._canvas.current;
      var ctx = getDrawingContext(canvas);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 255, 0, 1)';
      ctx.fillRect(0, 0, tileSize, tileSize);
      ctx.drawImage(selectedTile.getCanvas(), 0, 0);
      if (tileMode !== "SELECT") {
        ctx.drawImage(whiteSquare, 23, 23);
      }
    }
  };

  suffixIcon = ({ selectedTile, tileMode }) => {
    if (!selectedTile) {
      return '';
    }
    if (tileMode === "INSERT") {
      return (<Glyphicon className="suffix" glyph="circle-arrow-right" />);
    }
    if (tileMode === "ADD") {
      return (<Glyphicon className="suffix" glyph="plus-sign" />);
    }
    if (tileMode === "SELECT") {
      return (<Glyphicon className="select-suffix" glyph="ban-circle" />);
    }
    return '';
  };

  menuItem = (mode, label) => {
    const { tileMode } = this.props;
    return (
      <MenuItem eventKey={mode} active={mode === tileMode}>
        {label}
      </MenuItem>
    );
  };

  render = () => {
    const { onModeChange } = this.props;
    return (
      <Dropdown id="tile-control-dropdown" onSelect={onModeChange} disabled={this.state.disabled}>
        <Button className="tile-button" disabled={this.state.disabled}>
          <div className="tile-button-container">
            <canvas className="tile-button-cvs" width={tileSize} height={tileSize}
                ref={this._canvas} />
            {this.suffixIcon(this.props)}
          </div>
        </Button>
        <Dropdown.Toggle className="tile-dropdown" />
        <Dropdown.Menu>
          {this.menuItem("INSERT", "Insert")}
          {this.menuItem("ADD", "Add")}
          {this.menuItem("SELECT", "Select")}
        </Dropdown.Menu>
      </Dropdown>
    );
  };
}

/* =============================================================================
 * COMPONENT: OPEN MAP MODAL
 * =============================================================================
 */
const OpenMapModal = ({ error, maps, onMapSelected, showModal, onClose }) => {
  var showError = error && error.length > 0;

  var items = maps.map(map =>
    <ListGroupItem key={map.id} className="map-item" onClick={() => onMapSelected(map.id)}>
      {map.name}
    </ListGroupItem>
  );

  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Open Map</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Collapse in={showError}>
          <div>
            <Alert bsStyle="danger">{error}</Alert>
          </div>
        </Collapse>
        <ListGroup className="maps-list">{items}</ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

/* =============================================================================
 * COMPONENT: NEW MAP MODAL
 * =============================================================================
 */
class NewMapModal extends React.Component {
  constructor(props) {
    super(props);
    this._regex = /\D/g;
    this.state = {
      rowsVal: '',
      colsVal: ''
    };
  }

  handleRowsChange = evt => this.setState({ rowsVal: evt.target.value.replace(this._regex, '') });

  handleColsChange = evt => this.setState({ colsVal: evt.target.value.replace(this._regex, '') });

  handleSubmit = evt => {
    evt.preventDefault();
    this.newMap();
  };

  newMap = () => {
    const { onNewMap } = this.props;
    var rows = parseInt(this.state.rowsVal, 10);
    var cols = parseInt(this.state.colsVal, 10);
    if (rows > 0 && cols > 0) {
      onNewMap(rows, cols);
    }
  };

  render = () => {
    const { showModal, onClose } = this.props;
    return (
      <Modal show={showModal} onHide={onClose} bsSize="small">
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
          <Button onClick={onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

/* =============================================================================
 * COMPONENT: RESIZE MAP MODAL
 * =============================================================================
 */
class ResizeMapModal extends React.Component {
  constructor(props) {
    super(props);
    this._regex = /[^0-9-]/g;
    this.state = {
      leftVal: '',
      rightVal: '',
      topVal: '',
      bottomVal: ''
    };
  }

  handleLeftChange = evt => this.setState({ leftVal: evt.target.value.replace(this._regex, '') });

  handleRightChange = evt => this.setState({ rightVal: evt.target.value.replace(this._regex, '') });

  handleTopChange = evt => this.setState({ topVal: evt.target.value.replace(this._regex, '') });

  handleBottomChange = evt => this.setState({ bottomVal: evt.target.value.replace(this._regex, '') });

  handleSubmit = evt => {
    evt.preventDefault();
    this.newMap();
  };

  resizeMap = () => {
    var vals = [this.state.leftVal, this.state.rightVal, this.state.topVal, this.state.bottomVal]
        .map(val => {
          var n = parseInt(val, 10);
          return isNaN(n) ? 0 : n;
        }
    );
    if (vals.some(val => val !== 0)) {
      this.props.onResizeMap(vals[0], vals[1], vals[2], vals[3]);
    }
  };

  render = () => {
    const { showModal, onClose } = this.props;
    return (
      <Modal show={showModal} onHide={onClose} dialogClassName="resize-map-modal">
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
                    <FormControl type="text" placeholder="0-32"
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
          <Button onClick={onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

/* =============================================================================
 * COMPONENT: SAVE AS MODAL
 * =============================================================================
 */
class SaveAsModal extends React.Component {
  constructor(props) {
    super(props);
    this._regex = /\W/g;
    this.state = {
      mapName: '',
    };
  }

  handleNameChange = evt => this.setState({ mapName: evt.target.value.replace(this._regex, '') });

  handleSubmit = evt => {
    evt.preventDefault();
    this.saveMap();
  };

  saveMap = () => {
    var mapName = this.state.mapName;
    if (mapName.length > 0) {
      this.props.onSaveAs(mapName);
    }
  };

  render = () => {
    const { error, showModal, onClose } = this.props;
    var showError = error && error.length > 0;
    return (
      <Modal show={showModal} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Save As</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Collapse in={showError}>
            <div>
              <Alert bsStyle="danger">{error}</Alert>
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
          <Button onClick={onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

/* =============================================================================
 * COMPONENT: PROGRESS MODAL
 * =============================================================================
 */
const ProgressModal = ({ showModal, title, percent }) => (
  <Modal show={showModal}>
    <Modal.Header>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ProgressBar now={percent} />
    </Modal.Body>
  </Modal>
);

/* =============================================================================
 * COMPONENT: WARNING MODAL
 * =============================================================================
 */
const WarningModal = ({ showModal, onClose, onContinue, percent }) => (
  <Modal show={showModal} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Warning</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Alert bsStyle="warning">This will lose all unsaved changes. Continue?</Alert>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={() => {
        onClose();
        onContinue();
      }} bsStyle="primary">OK</Button>
      <Button onClick={onClose}>Cancel</Button>
    </Modal.Footer>
  </Modal>
);

/* =============================================================================
 * COMPONENT: ERROR MODAL
 * =============================================================================
 */
const ErrorModal = ({ showModal, onClose, title, error }) => (
  <Modal show={showModal} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Alert bsStyle="danger">{error}</Alert>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onClose}>Close</Button>
    </Modal.Footer>
  </Modal>
);

/* =============================================================================
 * COMPONENT: MAP TILE INFO
 * =============================================================================
 */
const MapTileInfo = ({ tilePosition, mapTile }) => {
  if (tilePosition && mapTile) {
    var levelsInfo = "[" + mapTile.getLevels().toString() + "]";
    var masks = mapTile.getMaskTiles().filter(maskTile => {
      return maskTile.getMaskLevel() ? true : false;
    }).map( maskTile => {
      return maskTile.getMaskLevel();
    });
    var masksInfo = "[" + masks.toString() + "]";
    return (
      <p className="with-top-margin">
        {tilePosition.x},{tilePosition.y} :: {mapTile.getMaskTiles().length} {levelsInfo} {masksInfo}
      </p>
    );
  }
  return (<p className="with-top-margin">-</p>);
};

export default MapEditor;
