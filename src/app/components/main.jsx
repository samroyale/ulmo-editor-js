var React = require('react'),
    ReactRouter = require('react-router'),
    Bootstrap = require('react-bootstrap'),
    TilePalette = require('./tile-palette.jsx'),
    MapEditor = require('./map-editor.jsx');

var Grid = Bootstrap.Grid,
    Row = Bootstrap.Row,
    Col = Bootstrap.Col,
    PageHeader = Bootstrap.PageHeader,
    Button = Bootstrap.Button,
    Router = ReactRouter.Router,
    Route = ReactRouter.Route
    IndexRoute = ReactRouter.IndexRoute,
    Link = ReactRouter.Link,
    browserHistory = ReactRouter.browserHistory;

/* =============================================================================
 * COMPONENT: APP
 * =============================================================================
 */
 const App = React.createClass({
   showEditorView() {
     browserHistory.push("/");
   },

   showTileSetAdminView: function() {
     browserHistory.push("/tiles-admin");
   },

   showMapAdminView: function() {
     browserHistory.push("/maps-admin");
   },

   render() {
     return (
       <Router history={browserHistory}>
         <Route path="/" component={Main}>
           <IndexRoute
             component={EditorView}
             onTileSetAdmin={this.showTileSetAdminView}
             onMapAdmin={this.showMapAdminView} />
           <Route path="/tiles-admin"
             component={TileSetAdminView}
             onBack={this.showEditorView} />
           <Route path="/maps-admin"
             component={MapAdminView}
             onBack={this.showEditorView} />
         </Route>
       </Router>
     )
   }
 });

 /* =============================================================================
  * COMPONENT: MAIN
  * =============================================================================
  */
function Main(props) {
  return (
    <Grid>
      <Row>
        <Col lg={12}>
          <PageHeader className="custom-header">Ulmo Editor <small>v0.1.0</small></PageHeader>
        </Col>
      </Row>
      {props.children}
    </Grid>
  );
};

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
    return (
      <Row>
        <Col className="tile-palette-col" lg={4}>
          <TilePalette
            onTileSelected={this.tileSelected}
            onAdmin={this.props.route.onTileSetAdmin} />
        </Col>
        <Col className="map-canvas-col" lg={8}>
          <MapEditor
            selectedTile={this.state.selectedTile}
            onAdmin={this.props.route.onMapAdmin} />
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
    return (
      <Row>
        <Col lg={12}>
          <h3>Tileset Admin goes here</h3>
          <Button onClick={this.props.route.onBack}>Back</Button>
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
    return (
      <Row>
        <Col lg={12}>
          <h3>Map Admin goes here</h3>
          <Button onClick={this.props.route.onBack}>Back</Button>
        </Col>
      </Row>
    );
  }
});

module.exports = App;
