var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    TilePalette = require('./tile-palette.jsx'),
    MapEditor = require('./map-editor.jsx');

var Grid = Bootstrap.Grid,
    Row = Bootstrap.Row,
    Col = Bootstrap.Col,
    PageHeader = Bootstrap.PageHeader,
    Button = Bootstrap.Button;

/* =============================================================================
 * COMPONENT: APP
 * =============================================================================
 */
const Main = React.createClass({
  getInitialState: function() {
    return { view: "EDITOR" };
  },

  showEditorView: function() {
    this.setState({ view: "EDITOR" });
  },

  showTileSetAdminView: function() {
    console.log("ts admin")
    this.setState({ view: "TILESETS" });
  },

  showMapAdminView: function() {
    this.setState({ view: "MAPS" });
  },

  render: function() {
    return (
      <Grid>
        <Row>
          <Col lg={12}>
            <PageHeader className="custom-header">Ulmo Editor <small>v0.1.0</small></PageHeader>
          </Col>
        </Row>
        <EditorView
          view={this.state.view}
          onTileSetAdmin={this.showTileSetAdminView}
          onMapAdmin={this.showMapAdminView} />
        <TileSetAdminView
          view={this.state.view}
          onBack={this.showEditorView} />
        <MapAdminView
          view={this.state.view}
          onBack={this.showEditorView} />
      </Grid>
    );
  }
});

/* =============================================================================
 * COMPONENT: EDITOR VIEW
 * =============================================================================
 */
const EditorView = React.createClass({
  getInitialState: function() {
    return { selectedTile: null };
  },

  tileSelected: function(tile) {
    this.setState({ selectedTile: tile });
  },

  render: function() {
    var bsClass = this.props.view === "EDITOR" ? "show" : "hidden";
    return (
      <Row className={bsClass}>
        <Col className="tile-palette-col" lg={4}>
          <TilePalette
            onTileSelected={this.tileSelected}
            onAdmin={this.props.onTileSetAdmin} />
        </Col>
        <Col className="map-canvas-col" lg={8}>
          <MapEditor
            selectedTile={this.state.selectedTile}
            onAdmin={this.props.onMapAdmin} />
        </Col>
      </Row>
    );
  }
});

/* =============================================================================
 * COMPONENT: TILE SET ADMIN VIEW
 * =============================================================================
 */
const TileSetAdminView = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var bsClass = this.props.view === "TILESETS" ? "show" : "hidden";
    return (
      <Row className={bsClass}>
        <Col lg={12}>
          <h3>Tileset Admin goes here</h3>
          <Button onClick={this.props.onBack}>Back</Button>
        </Col>
      </Row>
    );
  }
});

/* =============================================================================
 * COMPONENT: MAP ADMIN VIEW
 * =============================================================================
 */
const MapAdminView = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var bsClass = this.props.view === "MAPS" ? "show" : "hidden";
    return (
      <Row className={bsClass}>
        <Col lg={12}>
          <h3>Map Admin goes here</h3>
          <Button onClick={this.props.onBack}>Back</Button>
        </Col>
      </Row>
    );
  }
});

module.exports = Main;
