import React from 'react';
import { Grid, Row, Col, PageHeader, Button } from 'react-bootstrap';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import TilePalette from './tile-palette';
import MapEditor from './map-editor';
import './app.css';

/* =============================================================================
 * COMPONENT: MAIN
 * =============================================================================
 */
function Main(props) {
 return (
   <Grid>
     <Row>
       <Col lg={12}>
         <PageHeader className="app-header">Editor <small>v0.1.1</small></PageHeader>
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
const EditorView  = React.createClass({
  getInitialState() {
    return { selectedTile: null };
  },

  tileSelected(tile) {
    this.setState({ selectedTile: tile });
  },

  render() {
    return (
      <Row>
        <Col className="tile-palette-col" lg={4}>
          <TilePalette
            onTileSelected={this.tileSelected}
            onAdmin={this.props.route.onTileSetAdmin} />
        </Col>
        <Col className="map-editor-col" lg={8}>
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
  getInitialState() {
    return {};
  },

  render() {
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
  getInitialState() {
    return {};
  },

  render() {
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

/* =============================================================================
 * COMPONENT: APP
 * =============================================================================
 */
const App = React.createClass({
  showEditorView() {
    browserHistory.push("/");
  },

  showTileSetAdminView() {
    browserHistory.push("/tiles-admin");
  },

  showMapAdminView() {
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
    );
  }
});

export default App;
