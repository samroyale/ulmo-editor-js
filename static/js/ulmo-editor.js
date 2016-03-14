/* =============================================================================
 * COMPONENT: APP
 * =============================================================================
 */
const App = React.createClass({
  getInitialState: function() {
    return {
      selectedTile: null,
    }
  },

  tileSelected(tile) {
    this.setState({ selectedTile: tile });
  },

  render: function() {
    return (
      <div>
        <TilePalette onTileSelected={this.tileSelected}/>
        <hr />
        <MapEditor selectedTile={this.state.selectedTile} />
      </div>
    );
  }
});

/* =============================================================================
 * MIXIN: TILE POSITION
 * =============================================================================
 */
var tilePositionMixin = {
  getCurrentTilePosition: function(evt) {
    var x;
    var y;
    if (evt.pageX == undefined || evt.pageY == undefined) {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    else {
      x = evt.pageX;
      y = evt.pageY;
    }
    var canvasElement = evt.target;
    x = Math.max(Math.min(x - canvasElement.offsetLeft, canvasElement.width), 0);
    y = Math.max(Math.min(y - canvasElement.offsetTop, canvasElement.height), 0);
    return { 'x': Math.floor(x / this.props.tileSize), 'y': Math.floor(y / this.props.tileSize)};
  },

  /* Returns a tile highlight canvas */
  initTileHighlight: function() {
    var highlightCanvas = document.createElement("canvas");
    highlightCanvas.width = this.props.tileSize;
    highlightCanvas.height = this.props.tileSize;
    var ctx = highlightCanvas.getContext('2d');
    // transparent rect
    ctx.beginPath();
    ctx.rect(0, 0, this.props.tileSize, this.props.tileSize);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fill();
    ctx.closePath();
    // white border
    ctx.beginPath();
    ctx.rect(0, 0, this.props.tileSize, 2);
    ctx.rect(0, this.props.tileSize - 2, this.props.tileSize, 2);
    ctx.rect(0, 0, 2, this.props.tileSize);
    ctx.rect(this.props.tileSize - 2, 0, 2, this.props.tileSize);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    return highlightCanvas;
  }
};

/* =============================================================================
 * COMPONENT: TILE PALETTE
 * =============================================================================
 */
const TilePalette = React.createClass({

  _tilesetCanvas: null,

  getInitialState: function() {
    return {
      currentTilePosition: null,
      currentTile: null,
      tileSetId: null
    }
  },

  updateCurrentTile: function(tilePosition, tile) {
    this.setState({ currentTilePosition: tilePosition, currentTile: tile});
  },

  updateTileSet: function(tsid) {
    if (tsid.length == 0) {
      this._tilesetCanvas.hideTileset();
      return;
    }
    this._tilesetCanvas.loadTileset(tsid);
  },

  render: function() {
    return (
      <div>
        <TileSetPickerModal
            onTileSetSelected={this.updateTileSet} />
        <TileSetCanvas
            tileSetId={this.state.tileSetId}
            onTileSelected={this.props.onTileSelected}
            onTilePositionUpdated={this.updateCurrentTile}
            tilePosition={this.state.currentTilePosition}
            tile={this.state.currentTile}
            ref={function(comp) {
              this._tilesetCanvas = comp;
            }.bind(this)} />
        <TileInfo
            tilePosition={this.state.currentTilePosition}
            tile={this.state.currentTile} />
      </div>
    );
  }
});

/* =============================================================================
 * COMPONENT: TILE SET PICKER
 * =============================================================================
 */
const TileSetPickerModal = React.createClass({
  getDefaultProps: function() {
    return { apiUrl: "/api/tilesets" };
  },

  getInitialState() {
    return {
      showModal: false,
      tileSets: []
    };
  },

  close() {
    this.setState({ showModal: false });
  },

  /*open() {
    this.setState({ showModal: true });
  },*/

  tileSetSelected: function(tsid) {
    this.close();
    this.props.onTileSetSelected(tsid);
  },

  tileSetsLoaded: function(tileSetDefs) {
    this.setState({ tileSets: tileSetDefs, showModal: true });
  },

  loadTileSetsFromServer: function(event) {
    $.ajax({
      url: this.props.apiUrl,
      dataType: 'json',
      cache: false,
      success: this.tileSetsLoaded,
      error: function(xhr, status, err) {
        console.error(this.props.apiUrl, status, err.toString());
      }.bind(this)
    });
  },

  render() {
    var items = this.state.tileSets.map(function(tileSet) {
       return <TileSetItem key={tileSet._id} tileSet={tileSet} onTileSetSelected={this.tileSetSelected} />;
    }.bind(this));
    return (
      <div>
        <ReactBootstrap.Button bsStyle="primary" bsSize="medium" onClick={this.loadTileSetsFromServer}>
          Choose Tileset
        </ReactBootstrap.Button>

        <ReactBootstrap.Modal show={this.state.showModal} onHide={this.close}>
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>Tilesets</ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <ul>{items}</ul>
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>
      </div>
    );
  }
});

var TileSetItem = React.createClass({
  tileSetSelected: function(event) {
    event.preventDefault();
    this.props.onTileSetSelected(this.props.tileSet._id);
  },
  render: function() {
    return (<li><a href="#" onClick={this.tileSetSelected}>{this.props.tileSet.name}</a></li>);
  }
});

/* =============================================================================
 * COMPONENT: TILE SET CANVAS
 * =============================================================================
 */
var TileSetCanvas = React.createClass({
  mixins: [tilePositionMixin],

  _tileSet: null,
  _canvas: null,
  _highlight: null,

  getDefaultProps: function() {
    return {
      tileSize: 32,
      apiUrl: "/api/tilesets/",
      divStyle: { padding: "10px 0px" },
      cvsStyle: { backgroundColor: "#00FF00" }
    };
  },

  getInitialState() {
    return {
      showTileset: false,
    };
  },

  hideTileset() {
    this.setState({ showTileset: false });
  },

  loadTileset(tilesetId) {
    this._tileSet = new TileSet(this.props.apiUrl + tilesetId, this.props.tileSize, function() {
      this.drawTileSet();
      this.setState({ showTileset: true });
    }.bind(this));
  },

  initEmptyTile: function() {
    var emptyCanvas = document.createElement("canvas");
    emptyCanvas.width = this.props.tileSize;
    emptyCanvas.height = this.props.tileSize;
    var ctx = emptyCanvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.props.tileSize, this.props.tileSize);
    return emptyCanvas;
  },

  drawTileSet: function() {
    var cols = this._tileSet.getCols();
    var rows = this._tileSet.getRows();
    this._canvas.width = cols * this.props.tileSize;
    this._canvas.height = rows * this.props.tileSize;
    var ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    var emptyTile = this.initEmptyTile();
    for (var x = 0; x < cols; x++) {
      for (var y = 0; y < rows; y++) {
        var tile = this._tileSet.getTile(x, y);
        if (tile) {
          ctx.putImageData(tile._imageData, x * this.props.tileSize, y * this.props.tileSize);
        }
        else {
          ctx.drawImage(emptyTile, x * this.props.tileSize, y * this.props.tileSize);
        }
      }
    }
  },

  unhighlightTile: function(x, y, previousTile) {
    if (previousTile) {
      var ctx = this._canvas.getContext('2d');
      ctx.putImageData(previousTile._imageData, x * this.props.tileSize, y * this.props.tileSize);
    }
  },

  highlightTile: function(x, y, currentTile) {
    if (currentTile) {
      var ctx = this._canvas.getContext('2d');
      ctx.drawImage(this._highlight, x * this.props.tileSize, y * this.props.tileSize)
    }
  },

  handleMouseMove: function(evt) {
    var tilePosition = this.getCurrentTilePosition(evt);
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
    this._canvas = ReactDOM.findDOMNode(this.refs.cvs);
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
        <canvas ref="cvs" className={bsClass} style={this.props.cvsStyle}
            onMouseMove={this.handleMouseMove}
            onMouseOut={this.handleMouseOut}
            onClick={this.handleMouseClick} />
      </div>
    );
  }
});

/* =============================================================================
 * COMPONENT: MAP EDITOR
 * =============================================================================
 */
var MapEditor = React.createClass({

  _mapCanvas: null,

  getInitialState: function() {
    return {
      currentTilePosition: null,
      currentTile: null,
      mapId: null
    }
  },

  updateCurrentTile: function(tilePosition, tile) {
    this.setState({ currentTilePosition: tilePosition, currentTile: tile});
  },

  updateMap: function(mid) {
    if (mid.length == 0) {
      this._mapCanvas.hideMap()
      return;
    }
    this._mapCanvas.loadMap(mid)
  },

  saveMap: function() {
    this._mapCanvas.saveMap();
  },

  render: function() {
    return (
      <div>
        <MapToolbar
            onMapSelected={this.updateMap}
            onSaveMap={this.saveMap} />
        <MapCanvas
            mapId={this.state.mapId}
            onTilePositionUpdated={this.updateCurrentTile}
            selectedTile={this.props.selectedTile}
            tilePosition={this.state.currentTilePosition}
            mapTile={this.state.currentTile}
            ref={function(comp) {
              this._mapCanvas = comp;
            }.bind(this)} />
        <MapTileInfo
            tilePosition={this.state.currentTilePosition}
            mapTile={this.state.currentTile} />
      </div>
    );
  }
});

/* =============================================================================
 * COMPONENT: MAP PICKER
 * =============================================================================
 */
var MapToolbar = React.createClass({
  getDefaultProps: function() {
    return { apiUrl: "/api/maps" };
  },

  getInitialState() {
    return {
      showLoadModal: false,
      showNewModal: false,
      maps: []
    };
  },

  close() {
    this.setState({
      showLoadModal: false,
      showNewModal: false
    });
  },

  mapSelected: function(mid) {
    this.close();
    this.props.onMapSelected(mid);
  },

  mapsLoaded: function(mapDefs) {
    this.setState({ maps: mapDefs, showLoadModal: true });
  },

  loadMapsFromServer: function(event) {
    $.ajax({
      url: this.props.apiUrl,
      dataType: 'json',
      cache: false,
      success: this.mapsLoaded,
      error: function(xhr, status, err) {
        console.error(this.props.apiUrl, status, err.toString());
      }.bind(this)
    });
  },

  newMap: function(event) {
    this.setState({ showNewModal: true });
  },

  newMapOfSize(rows, cols) {
    this.close();
    alert(rows + " : " + cols);
  },

  render() {
    return (
      <div>
        <ReactBootstrap.ButtonToolbar>
          <ReactBootstrap.Button bsStyle="primary" bsSize="medium" onClick={this.loadMapsFromServer}>
            Choose Map
          </ReactBootstrap.Button>
          <ReactBootstrap.Button bsStyle="primary" bsSize="medium" onClick={this.newMap}>
            New Map
          </ReactBootstrap.Button>
          <ReactBootstrap.Button bsStyle="primary" bsSize="medium" onClick={this.props.onSaveMap}>
            Save Map
          </ReactBootstrap.Button>
        </ReactBootstrap.ButtonToolbar>

        <ChooseMapModal
            showModal={this.state.showLoadModal}
            maps={this.state.maps}
            onMapSelected={this.mapSelected}
            onClose={this.close} />

        <NewMapModal
            showModal={this.state.showNewModal}
            onNewMap={this.newMapOfSize}
            onClose={this.close} />
      </div>
    );
  }
});

/* =============================================================================
 * COMPONENT: CHOOSE MAP MODAL
 * =============================================================================
 */
function ChooseMapModal(props) {
  var items = props.maps.map(function(map) {
     return <MapItem key={map._id} map={map} onMapSelected={props.onMapSelected} />;
  }.bind(this));

  return (
    <ReactBootstrap.Modal show={props.showModal} onHide={props.onClose}>
      <ReactBootstrap.Modal.Header closeButton>
        <ReactBootstrap.Modal.Title>Choose Map</ReactBootstrap.Modal.Title>
      </ReactBootstrap.Modal.Header>
      <ReactBootstrap.Modal.Body>
        <ul>{items}</ul>
      </ReactBootstrap.Modal.Body>
    </ReactBootstrap.Modal>
  );
}

/* =============================================================================
 * COMPONENT: MAP ITEM
 * =============================================================================
 */
var MapItem = React.createClass({
  mapSelected: function(event) {
    event.preventDefault();
    this.props.onMapSelected(this.props.map._id);
  },

  render: function() {
    return (<li><a href="#" onClick={this.mapSelected}>{this.props.map.name}</a></li>);
  }
});

var NewMapModal = React.createClass({
  getInitialState: function() {
    return {
      rowsVal: '',
      colsVal: ''
    };
  },

  handleRowsChange: function(event) {
    var re = /\d*/g;
    this.setState({rowsVal: re.exec(event.target.value)});
  },

  handleColsChange: function(event) {
    var re = /\d*/g;
    this.setState({colsVal: re.exec(event.target.value)});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var rows = parseInt(this.state.rowsVal, 10);
    var cols = parseInt(this.state.colsVal, 10);
    if (rows > 0 && cols > 0) {
      this.props.onNewMap(rows, cols);
    }
    // this.props.onClose();
  },

  render() {
    return (
      <ReactBootstrap.Modal show={this.props.showModal} onHide={this.props.onClose}>
        <ReactBootstrap.Modal.Header closeButton>
          <ReactBootstrap.Modal.Title>New Map</ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>
        <ReactBootstrap.Modal.Body>
        <form onSubmit={this.handleSubmit}>
          <ReactBootstrap.Input type="text" label="Rows" placeholder="0-32" value={this.state.rowsVal} onChange={this.handleRowsChange} />
          <ReactBootstrap.Input type="text" label="Cols" placeholder="0-32" value={this.state.colsVal} onChange={this.handleColsChange} />
          <ReactBootstrap.ButtonInput type="submit" value="OK" />
        </form>
        </ReactBootstrap.Modal.Body>
      </ReactBootstrap.Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: MAP CANVAS
 * =============================================================================
 */
var MapCanvas = React.createClass({
  mixins: [tilePositionMixin],

  _rpgMap: null,
  _canvas: null,
  _highlight: null,

  getDefaultProps: function() {
    return {
      tileSize: 32,
      baseColours: ["#99CCCC", "#CC99CC"],
      apiUrl: "/api/maps/",
      divStyle: { padding: "10px 0px" },
      cvsStyle: { backgroundColor: "#00FF00" }
    };
  },

  getInitialState() {
    return {
      showMap: false,
    };
  },

  hideMap: function() {
    this.setState({ showMap: false });
  },

  loadMap: function(mapId) {
    this._rpgMap = new RpgMap(this.props.apiUrl + mapId, this.props.tileSize, this.props.baseColours, function() {
      this.drawMap();
      this.setState({ showMap: true });
    }.bind(this));
  },

  saveMap: function() {
    if (this._rpgMap) {
      this._rpgMap.saveToServer(this.props.apiUrl + this.props.mapId);
    }
  },

  drawMap: function() {
    var cols = this._rpgMap.getCols();
    var rows = this._rpgMap.getRows();
    this._canvas.width = cols * this.props.tileSize;
    this._canvas.height = rows * this.props.tileSize;
    var ctx = this._canvas.getContext('2d');
    for (var x = 0; x < cols; x++) {
      for (var y = 0; y < rows; y++) {
        ctx.putImageData(this._rpgMap.getMapTile(x, y)._imageData, x * this.props.tileSize, y * this.props.tileSize)
      }
    }
  },

  unhighlightTile: function(x, y, previousTile) {
    if (previousTile) {
      var ctx = this._canvas.getContext('2d');
      ctx.putImageData(previousTile._imageData, x * this.props.tileSize, y * this.props.tileSize);
    }
  },

  highlightTile: function(x, y, currentTile) {
    if (currentTile) {
      var ctx = this._canvas.getContext('2d');
      ctx.drawImage(this._highlight, x * this.props.tileSize, y * this.props.tileSize)
    }
  },

  handleMouseMove: function(evt) {
    var tilePosition = this.getCurrentTilePosition(evt);
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
    this._canvas = ReactDOM.findDOMNode(this.refs.cvs);
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
      <div style={this.props.divStyle}>
        <canvas ref="cvs" className={bsClass} style={this.props.cvsStyle}
            onMouseMove={this.handleMouseMove}
            onMouseOut={this.handleMouseOut}
            onClick={this.handleMouseClick} />
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
    return (<p>{props.tilePosition.x}, {props.tilePosition.y} :: {props.tile._tileSetName}:{props.tile._tileName}</p>);
  }
  return (<p>-</p>);
}

/* =============================================================================
 * COMPONENT: MAP TILE INFO
 * =============================================================================
 */
function MapTileInfo(props) {
  if (props.tilePosition && props.mapTile) {
    var levelsInfo = "[" + props.mapTile._levels.toString() + "]";
    return (<p>{props.tilePosition.x}, {props.tilePosition.y} :: {props.mapTile._maskTiles.length} {levelsInfo}</p>);
  }
  return (<p>-</p>);
}

/* =============================================================================
 * CLASS: RPG MAP
 * -----------------------------------------------------------------------------
 * The model representing a map of tiles.
 * =============================================================================
 */
class RpgMap {
  constructor(mapUrl, tileSize, baseColours, callback) {
    this._name = null;
    this._mapTiles = null;
    this._baseTiles = baseColours.map(function(baseColour) {
      return this.initBaseCanvas(baseColour, tileSize);
    }.bind(this));
    this.loadFromServer(mapUrl, tileSize, callback);
  }

  saveToServer(mapUrl) {
    console.log("Saving map: " + mapUrl);
    $.ajax({
      type: "PUT",
      url: mapUrl,
      dataType: 'json',
      data: this.getDto(),
      success: function(data) {
        console.log(data.message);
      },
      error: function(xhr, status, err) {
        console.error(mapUrl, status, err.toString());
      }
    });
  }

  loadFromServer(mapUrl, tileSize, callback) {
    console.log("Loading map: " + mapUrl);
    $.ajax({
      url: mapUrl,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.initRpgMap(data, tileSize, callback);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(mapUrl, status, err.toString());
      }
    });
  }

  initRpgMap(rpgMapDef, tileSize, callback) {
    this._name = rpgMapDef.name;
    var tileSetMappings = new Map();
    rpgMapDef.mapTiles.forEach(function(mapTileDef) {
      mapTileDef.tiles.forEach(function(tileDef) {
        tileSetMappings.set(tileDef.tileSet, null);
      });
    });
    tileSetMappings.forEach(function(value, key) {
      new TileSet("/api/tilesets/tileset?name=" + key, tileSize, function(tileSet) {
        this.tileSetReady(tileSet, tileSetMappings, rpgMapDef, callback);
      }.bind(this));
    }.bind(this));
  }

  tileSetReady(tileSet, tileSetMappings, rpgMapDef, callback) {
    console.log("> Tileset loaded: " + tileSet._name);
    tileSetMappings.set(tileSet._name, tileSet);
    var tileSetsLoaded = true;
    tileSetMappings.forEach(function(value, key) {
      if (!value) {
        tileSetsLoaded = false;
      }
    });
    if (tileSetsLoaded) {
      this._mapTiles = this.initMapTiles(tileSetMappings, rpgMapDef);
      callback(this);
    }
  }

  initMapTiles(tileSetMappings, rpgMapDef) {
    //var baseColours = ["#99CCCC", "#CC99CC"];
    var tileDefKey = function(x, y) {
      return x + "-" + y;
    }
    var tileDefMappings = {};
    rpgMapDef.mapTiles.forEach(function(mapTileDef) {
      var key = tileDefKey(mapTileDef.xy[0], mapTileDef.xy[1]);
      tileDefMappings[key] = mapTileDef;
    });
    var rows = rpgMapDef.rows, cols = rpgMapDef.cols;
    var tiles = new Array(cols);
    for (var x = 0; x < cols; x++) {
      tiles[x] = new Array(rows);
      for (var y = 0; y < rows; y++) {
        var mapTileDef = tileDefMappings[tileDefKey(x, y)];
        var baseCanvas = this._baseTiles[(x + y) % this._baseTiles.length];
        if (mapTileDef) {
          var maskTiles = mapTileDef.tiles.map(function(tileDef) {
            var tile = tileSetMappings.get(tileDef.tileSet).getTileByName(tileDef.tile);
            return new MaskTile(tile, tileDef.maskLevel);
          }.bind(this));
          tiles[x][y] = new MapTile(baseCanvas, maskTiles, mapTileDef.levels);
        }
        else {
          tiles[x][y] = new MapTile(baseCanvas);
        }
      }
    }
    return tiles;
  }

  initBaseCanvas(colour, tileSize) {
    var tileCanvas = document.createElement("canvas");
    tileCanvas.width = tileSize;
    tileCanvas.height = tileSize;
    var ctx = tileCanvas.getContext('2d');
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, tileSize, tileSize);
    return tileCanvas;
  }

  getMapTile(x, y) {
    return this._mapTiles[x][y];
  }

  getCols() {
    return this._mapTiles.length;
  }

  getRows() {
    return this._mapTiles[0].length;
  }

  getDto() {
    var rrows = this.getRows(), ccols = this.getCols();
    var myMapTiles = [];
    for (var x = 0; x < ccols; x++) {
      for (var y = 0; y < rrows; y++) {
        var mapTile = this._mapTiles[x][y].getDto(x, y);
        if (mapTile) {
          myMapTiles.push(mapTile)
        }
      }
    }
    return {
      name: this._name,
      rows: rrows,
      cols: ccols,
      mapTiles: myMapTiles
    }
  }
}

/* =============================================================================
 * CLASS: MAP TILE
 * -----------------------------------------------------------------------------
 * The relationship between tiles is MapTile ->* MaskTile -> Tile
 * =============================================================================
 */
class MapTile {
  constructor(baseTileCanvas, maskTiles, levels) {
    this._baseTileCanvas = baseTileCanvas;
    this._maskTiles = maskTiles ? maskTiles : [];
    this._levels = levels ? levels : [];
    this._imageData = this.initImageData();
  }

  initImageData() {
    var emptyCanvas = document.createElement("canvas");
    emptyCanvas.width = this._baseTileCanvas.width;
    emptyCanvas.height = this._baseTileCanvas.height;
    var ctx = emptyCanvas.getContext('2d');
    ctx.drawImage(this._baseTileCanvas, 0, 0);
    if (this._maskTiles) {
      this._maskTiles.forEach(function(maskTile) {
        ctx.drawImage(maskTile._tile._canvas, 0, 0);
      });
    }
    return ctx.getImageData(0, 0, emptyCanvas.width, emptyCanvas.height);
  }

  /*setMaskTiles(maskTiles) {
    this._maskTiles = maskTiles;
    this._imageData = this.initImageData();
  }*/

  addMaskTile(maskTile) {
    this._maskTiles.push(maskTile);
    this._imageData = this.initImageData();
  }

  /*setLevels(levels) {
    this._levels = levels;
  }*/

  getDto(x, y) {
    if (this._maskTiles) {
      return {
        xy: [x, y],
        tiles: this._maskTiles.map(function(maskTile) {
          return maskTile.getDto();
        }),
        levels: this._levels
      }
    }
    return null;
  }
}

/* =============================================================================
 * CLASS: MASK TILE
 * -----------------------------------------------------------------------------
 * Simple wrapper for a standard tile that adds masking information.
 * =============================================================================
 */
class MaskTile {
  constructor(tile, maskLevel) {
    this._tile = tile; // standard tile
    this._maskLevel = maskLevel; // string
  }

  getDto() {
    return {
      tileSet: this._tile._tileSetName,
      tile: this._tile._tileName,
      maskLevel: this._maskLevel
    }
  }
}

/* =============================================================================
 * CLASS: TILE SET
 * =============================================================================
 */
class TileSet {
  constructor(tileSetUrl, tileSize, callback) {
    this._name = null;
    this._tileNameMappings = {};
    this._tiles = null;
    this.loadFromServer(tileSetUrl, tileSize, callback);
  }

  loadFromServer(tileSetUrl, tileSize, callback) {
    $.ajax({
      url: tileSetUrl,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.initTileSet(data, tileSize, callback);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(tileSetUrl, status, err.toString());
      }
    });
  }

  initTileSet(tileSetDef, tileSize, callback) {
    this._name = tileSetDef.name;
    var tileSetImage = new Image();
    tileSetImage.onload = function() {
      this._tiles = this.processTileSet(tileSetDef, tileSetImage, tileSize);
      callback(this);
    }.bind(this);
    tileSetImage.src = tileSetDef.imageUrl;
  }

  processTileSet(tileSetDef, tileSetImage, tileSize) {
    // parse the tile names
    var tileDefKey = function(x, y) {
      return x + "-" + y;
    };
    var tileDefMappings = {};
    tileSetDef.tiles.forEach(function(tileDef) {
      var key = tileDefKey(tileDef.xy[0], tileDef.xy[1]);
      tileDefMappings[key] = tileDef;
    });
    // draw tileSet image to canvas and scale it x2
    var tileSetCanvas = document.createElement("canvas");
    tileSetCanvas.width = tileSetImage.width * 2;
    tileSetCanvas.height = tileSetImage.height * 2;
    var ctx = this.getDrawingContext(tileSetCanvas);
    ctx.drawImage(tileSetImage, 0, 0, tileSetCanvas.width, tileSetCanvas.height);
    // extract tiles and store them in a 2D array
    var cols = Math.floor(tileSetCanvas.width / tileSize);
    var rows = Math.floor(tileSetCanvas.height / tileSize);
    var tiles = new Array(cols);
    for (var x = 0; x < cols; x++) {
      tiles[x] = new Array(rows);
      for (var y = 0; y < rows; y++) {
        var tileCanvas = document.createElement("canvas");
        tileCanvas.width = tileSize;
        tileCanvas.height = tileSize;
        var tileCtx = tileCanvas.getContext('2d');
        var tileImageData = ctx.getImageData(x * tileSize, y * tileSize,
            tileSize, tileSize);
        tileCtx.putImageData(tileImageData, 0, 0);
        var tileDef = tileDefMappings[tileDefKey(x, y)];
        if (tileDef) {
          tiles[x][y] = new Tile(tileSetDef.name, tileDef.name, tileCanvas);
          this._tileNameMappings[tileDef.name] = tiles[x][y];
        }
      }
    }
    return tiles;
  }

  getDrawingContext(canvas) {
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    //context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    return context;
  }

  getTile(x, y) {
    return this._tiles[x][y];
  }

  getTileByName(name) {
    return this._tileNameMappings[name];
  }

  getCols() {
    return this._tiles.length;
  }

  getRows() {
    return this._tiles[0].length;
  }
}

/* =============================================================================
 * CLASS: TILE
 * =============================================================================
 */
class Tile {
  constructor(tileSetName, tileName, tileCanvas) {
    this._tileSetName = tileSetName;
    this._tileName = tileName;
    this._canvas = tileCanvas;
    var ctx = this._canvas.getContext('2d');
    this._imageData = ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
  }
}

/* ========================================================================== */

ReactDOM.render(<App />, document.getElementById('app'));
