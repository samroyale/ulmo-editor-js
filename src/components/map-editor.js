import React from 'react';
import { Panel, Modal, Grid, Row, Col, ButtonToolbar, Button, DropdownButton,
    ListGroup, ListGroupItem, Dropdown, MenuItem, Collapse, Alert, Form, FormGroup,
    FormControl, ControlLabel, ProgressBar, Glyphicon, Well} from 'react-bootstrap';
import MapCanvas from './map-canvas';
import RpgMapService from '../services/rpg-maps';
import { tileSize } from '../config';
import { errorMessage, loadImage, getDrawingContext } from '../utils';
import './map-editor.css';

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
  },

  closeModal: function() {
    this.setState({
      showModal: null,
      showProgressModal: false,
      serviceError: null
    });
  },

  closeProgressModal: function() {
    this.setState({ showProgressModal: false });
  },

  showProgressModal: function(title) {
    this.setState({
      showProgressModal: true,
      progressTitle: title,
      progressPercent: 0
    });
  },

  closeWarningModal: function() {
    this.setState({ showWarningModal: false });
  },

  closeErrorModal: function() {
    this.setState({
      serviceError: null,
      showErrorModal: false
    });
  },

  showWarningModal: function(callback) {
    this.setState({
      showWarningModal: true,
      continue: callback
    });
  },

  updateProgress: function(percent) {
    // console.log(percent);
    this.setState({ progressPercent: percent });
  },

  mapSelected: function(mid) {
    if (this.state.mapDirty) {
      this.showWarningModal(() =>
        this.continueMapSelected(mid)
      );
      return;
    }
    this.continueMapSelected(mid);
  },

  continueMapSelected: function(mid) {
    this.showProgressModal("Loading map...");
    var p = this._mapCanvas.loadMap(mid);
    p.then(
      data => this.mapLoaded(data, false), this.mapLoadErr,
      percent => this.updateProgress(percent)
    ).done();
  },

  newMap: function(event) {
    this.setState({ showModal: "NEW" });
  },

  newMapOfSize: function(rows, cols) {
    if (this.state.mapDirty) {
      this.showWarningModal(() =>
        this.continueNewMapOfSize(rows, cols)
      );
      return;
    }
    this.continueNewMapOfSize(rows, cols);
  },

  continueNewMapOfSize: function(rows, cols) {
    var p = this._mapCanvas.newMap(rows, cols);
    p.then(
      data => this.mapLoaded(data, true)
    ).done();
  },

  resizeMap: function(event) {
    if (this.isMapPresent()) {
      this.setState({ showModal: "RESIZE" });
    }
  },

  resizeMapToSize: function(left, right, top, bottom) {
    var p = this._mapCanvas.resizeMap(left, right, top, bottom);
    p.then(
      data => this.mapLoaded(data, true)
    ).done();
  },

  mapLoaded: function(data, dirty) {
    console.log("map loaded: " + data.map.getId());
    if (data.map) {
      this.closeModal();
      this.setState({
        mapId: data.map.getId(),
        mapDirty: dirty,
        serviceError: null
      });
    }
    // oldMap is present only on resize
    if (data.oldMap) {
      this.addToChangeHistory({ map: data.oldMap });
      return;
    }
    this.setState({ changeHistory: [] });
  },

  mapLoadErr: function(data) {
    this.closeProgressModal();
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      this.setState({
        serviceError: errorMessage("Could not load map", data)
      });
      return;
    }
    console.log("Something went wrong...");
  },

  loadMapsFromServer: function(event) {
    var p = rpgMapService.loadMaps();
    p.then(data => {
      if (data.maps) {
        this.setState({
          maps: data.maps,
          serviceError: null,
          showModal: "OPEN"
        });
      }
    }, this.mapsLoadErr).done();
  },

  mapsLoadErr: function(data) {
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      this.setState({
        serviceError: errorMessage("Could not load maps", data),
        showErrorModal: true,
        errorModalTitle: "Open Map"
      });
      return;
    }
    console.log("Something went wrong...");
  },

  showSaveModal: function() {
    if (this.isMapPresent()) {
      this.setState({ showModal: "SAVE" });
    }
  },

  isMapPresent: function() {
    // a mapId of undefined or something indicates that we have a map, whereas
    // null indicates that we don't
    return this.state.mapId !== null;
  },

  saveMap: function() {
    if (!this.state.mapId) {
      this.showSaveModal();
      return;
    }
    var p = this._mapCanvas.saveMap();
    p.then(this.mapSaved, this.mapSaveErr).done();
  },

  saveMapAs: function(mapName) {
    var p = this._mapCanvas.saveMapAs(mapName);
    p.then(this.mapSaved, this.mapSaveErr).done();
  },

  mapSaved: function(data) {
    if (data.mapId) {
      // console.log("Map saved [" + data.mapName + "/" + data.mapId + "]");
      this.closeModal();
      this.setState({
        mapId: data.mapId,
        mapDirty: false,
        serviceError: null
      });
    }
  },

  mapSaveErr: function(data) {
    if (data.err) {
      // console.log("Error [" + data.err + "]");
      this.setState({
        serviceError: errorMessage("Could not save map", data)
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
  },

  mapUpdated: function(topLeft, oldTiles) {
    this.setState({ mapDirty: true });
    if (!topLeft || !oldTiles) {
      return;
    }
    this.addToChangeHistory({
      topLeft: topLeft,
      tiles: oldTiles
    });
  },

  addToChangeHistory: function(item) {
    var history = this.state.changeHistory;
    history.push(item);
    this.setState( { changeHistory: history });
  },

  undo: function() {
    var history = this.state.changeHistory;
    var lastChange = history.pop();
    this.setState( { changeHistory: history });
    if (lastChange.topLeft) {
      this._mapCanvas.restoreTiles(lastChange.topLeft, lastChange.tiles);
      return;
    }
    if (lastChange.map) {
      this._mapCanvas.restoreMap(lastChange.map);
      return;
    }
    console.log("Could not undo [unknown change]");
  },

  updateCurrentTile: function(tilePosition, tile) {
    this.setState({ currentTilePosition: tilePosition, currentTile: tile});
  },

  setTileControlMode: function(mode) {
    this.setState({ tileMode: mode });
  },

  editSprites: function() {
    if (this.isMapPresent()) {
      this.setState({
        showModal: "SPRITES",
        sprites: this._mapCanvas.getSpritesFromMap()
      });
    }
  },

  applySpritesEdit: function(newSprites) {
    this.closeModal();
    this._mapCanvas.applySpritesEdit(newSprites)
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
        <Panel className="component" bsClass="component-panel">
          <MapToolbar
              selectedTile={this.props.selectedTile}
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
              onAdmin={this.props.onAdmin} />
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
  }
});

/* =============================================================================
 * COMPONENT: MAP TOOLBAR
 * =============================================================================
 */
function MapToolbar(props) {
  return (
    <ButtonToolbar className="component-buttons">
      <TileControl
          selectedTile={props.selectedTile}
          tileMode={props.tileMode}
          onModeChange={props.onModeChange} />
      <Button onClick={props.onLoadMapsFromServer}>Open</Button>
      <Button onClick={props.onNewMap}>New</Button>
      <Button onClick={props.onResizeMap} disabled={!props.mapPresent}>Resize</Button>
      <DropdownButton title="File" id="file" disabled={!props.mapPresent}>
        <MenuItem onClick={props.onSaveMap} disabled={!props.mapDirty}>Save</MenuItem>
        <MenuItem onClick={props.onShowSaveModal}>Save as</MenuItem>
        <MenuItem onClick={props.onExport}>Export</MenuItem>
      </DropdownButton>
      <Button onClick={props.onEditSprites} disabled={!props.mapPresent}>Sprites</Button>
      <Button onClick={props.onUndo} disabled={props.noHistory}>
        <div className="reverse"><Glyphicon glyph="repeat" /></div>
      </Button>
      { /*<Button bsStyle="link" onClick={props.onAdmin}>Admin</Button>*/ }
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

  componentWillReceiveProps: function(nextProps) {
    // if selecting a tile for the first time, set the tile mode to INSERT
    if (nextProps.tileMode) {
      this.setState({ disabled: false });
    }
  },

  componentDidUpdate: function(oldProps, oldState) {
    if (this.props.selectedTile) {
      var ctx = getDrawingContext(this._canvas);
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
    return (
      <MenuItem eventKey={mode} active={mode === this.props.tileMode}>
        {label}
      </MenuItem>
    );
  },

  render: function() {
    return (
      <Dropdown id="tile-control-dropdown" onSelect={this.props.onModeChange}>
        <Button className="tile-button" disabled={this.state.disabled}>
          <canvas className="tile-button-cvs" width={tileSize + 2} height={tileSize + 2}
              ref={cvs => this._canvas = cvs} />
        </Button>
        <Dropdown.Toggle className="tile-dropdown" disabled={this.state.disabled} />
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
          var n = parseInt(val, 10);
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
      <Modal show={this.props.showModal} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Save As</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Collapse in={showError}>
            <div>
              <Alert bsStyle="danger">Could not save map: {this.props.error}</Alert>
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
 * COMPONENT: PROGRESS MODAL
 * =============================================================================
 */
function ProgressModal(props) {
  return (
    <Modal show={props.showModal}>
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar now={props.percent} />
      </Modal.Body>
    </Modal>
  );
}

/* =============================================================================
 * COMPONENT: WARNING MODAL
 * =============================================================================
 */
function WarningModal(props) {
  const onContinue = () => {
    props.onClose();
    props.onContinue();
  };
  return (
    <Modal show={props.showModal} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert bsStyle="warning">This will lose all unsaved changes. Continue?</Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onContinue} bsStyle="primary">OK</Button>
        <Button onClick={props.onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

/* =============================================================================
 * COMPONENT: ERROR MODAL
 * =============================================================================
 */
function ErrorModal(props) {
  return (
    <Modal show={props.showModal} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert bsStyle="danger">{props.error}</Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

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
      <p className="with-top-margin">
        {props.tilePosition.x},{props.tilePosition.y} :: {props.mapTile.getMaskTiles().length} {levelsInfo} {masksInfo}
      </p>
    );
  }
  return (<p className="with-top-margin">-</p>);
}

/* =============================================================================
 * COMPONENT: SPRITES MODAL
 * =============================================================================
 */
const SpritesModal = React.createClass({
  getInitialState: function() {
    return {
      sprites: [],
    };
  },

  handleSubmit: function(e) {
    this.props.onSubmit(this.state.sprites);
  },

  delete: function(evt) {
    console.log("DELETE: " + evt.currentTarget.id);
    var buttonId = evt.currentTarget.id;
    var index = parseInt(buttonId.slice(3), 10);
    var newSprites = this.state.sprites;
    newSprites.splice(index, 1);
    this.setState({ sprites: newSprites });
  },

  edit: function(evt) {
    console.log("EDIT: " + evt.currentTarget.id);
  },

  componentWillMount: function() {
    this.populateStateFromProps(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    this.populateStateFromProps(nextProps);
  },

  populateStateFromProps: function(props) {
    if (props.showModal) {
      this.setState({ sprites: props.sprites.slice() });
    }
  },

  // sprites: function() {
  //   return this.state.sprites.map((s, i) => {
  //     return (
  //       <li key={i}>{s.getType()} :: {s.getLevel()} :: {s.getLocation().map((l, j) => {
  //         return <inline key={j}>[{l[0]},{l[1]}] </inline>;
  //       })} <Button id={'btn' + i} onClick={this.delete}>x</Button></li>
  //     );
  //   })
  // },

  sprites: function() {
    return this.state.sprites.map((sprite, i) => {
      var location = sprite.getLocation()
          .map(loc => '[' + loc[0] + ',' + loc[1] + ']')
          .join(' ');
      return (
        <SpriteItem
            key={i}
            buttonId={'btn' + i}
            type={sprite.getType()}
            level={sprite.getLevel()}
            location={location}
            onEdit={this.edit}
            onDelete={this.delete} />
      );
    })
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose} dialogClassName="sprites-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Sprites</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Panel className="sprites-panel">
            <ListGroup fill>{this.sprites()}</ListGroup>
          </Panel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit} bsStyle="primary">OK</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: SPRITE ITEM
 * =============================================================================
 */
const SpriteItem = React.createClass({

  typeLabel: function() {
    return this.props.type[0].toUpperCase() + this.props.type.slice(1);
  },

  render: function() {
    return (
        <ListGroupItem className="sprite-list-item">
          <Grid>
            <Row>
              <Col className="sprite-type-col" lg={1}>
                <Well className="sprite-well" bsSize="small"><b>{this.typeLabel()}</b></Well>
              </Col>
              <Col className="sprite-level-col" lg={1}>
                <Well className="sprite-well" bsSize="small">level: {this.props.level}</Well>
              </Col>
              <Col className="edit-sprite-col" lg={3}>
                <Well className="sprite-well" bsSize="small"><div className="sprite-location">{this.props.location}</div></Well>
              </Col>
              <Col className="edit-sprite-col" lg={2}>
                <ButtonToolbar className="sprite-controls">
                  <Button id={this.props.buttonId} onClick={this.props.onEdit}>
                    <Glyphicon glyph="edit" />
                  </Button>
                  <Button id={this.props.buttonId} onClick={this.props.onDelete}>
                    <Glyphicon glyph="trash" />
                  </Button>
                </ButtonToolbar>
              </Col>
            </Row>
          </Grid>
        </ListGroupItem>
    );
  }
});

export default MapEditor;
