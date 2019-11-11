import React from 'react';
import { Grid, Row, Col, PageHeader, Button } from 'react-bootstrap';
// import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import TilePalette from './TilePalette';
import MapEditor from './MapEditor';
import './App.css';

/* =============================================================================
 * COMPONENT: MAIN
 * =============================================================================
 */
const App = () => (
  <Router>
  <Grid>
    <Row>
      <Col lg={12}>
        <PageHeader className="app-header">Ulmo Editor <small>v0.5.0</small></PageHeader>
      </Col>
    </Row>
    <Route exact path="/" component={Home} />
    <Route path="/tiles-admin" component={TileSetAdminView} />
    <Route path="/maps-admin" component={MapAdminView} />
  </Grid>
  </Router>
);

/* =============================================================================
 * COMPONENT: EDITOR VIEW
 * =============================================================================
 */
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTile: null
    };
  }

  tileSelected = tile => this.setState({ selectedTile: tile });

  render = () => {
    return (
      <Row>
        <Col className="tile-palette-col" lg={4}>
          <TilePalette
            onTileSelected={this.tileSelected} />
        </Col>
        <Col className="map-editor-col" lg={8}>
          <MapEditor
            selectedTile={this.state.selectedTile} />
        </Col>
      </Row>
    );
  };
}

/* =============================================================================
* COMPONENT: TILE SET ADMIN VIEW
* =============================================================================
*/
const TileSetAdminView = ({ route }) => (
  <Row>
    <Col lg={12}>
      <h3>Tileset Admin goes here</h3>
      <Button onClick={console.log('back')}>Back</Button>
    </Col>
  </Row>
);

/* =============================================================================
* COMPONENT: MAP ADMIN VIEW
* =============================================================================
*/
const MapAdminView = ({ route }) => (
  <Row>
    <Col lg={12}>
      <h3>Map Admin goes here</h3>
      <Button onClick={console.log('back')}>Back</Button>
    </Col>
  </Row>
);

/* =============================================================================
 * COMPONENT: APP
 * =============================================================================
 */
// class App extends React.Component {
//   // showEditorView = () => browserHistory.push("/");
//   //
//   // showTileSetAdminView = () => browserHistory.push("/tiles-admin");
//   //
//   // showMapAdminView = () => browserHistory.push("/maps-admin");
//
//   render = () => {
//     return (
//       <Switch>
//         <Route exact path='/' component={Main} />
//         <Route path='/tiles-admin' component={TileSetAdminView} />
//         <Route path='/maps-admin' component={MapAdminView} />
//       </Switch>
//     );
//   }
// }

export default App;
