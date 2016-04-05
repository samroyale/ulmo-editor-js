var React = require('react');
var Bootstrap = require('react-bootstrap');
var TilePalette = require('./tile-palette.jsx');
var MapEditor = require('./map-editor.jsx');

var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var PageHeader = Bootstrap.PageHeader;

/* =============================================================================
 * COMPONENT: APP
 * =============================================================================
 */
const Main = React.createClass({
  getInitialState: function() {
    return {
      selectedTile: null,
    }
  },

  tileSelected: function(tile) {
    this.setState({ selectedTile: tile });
  },

  render: function() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={18} md={12}>
            <div className="my-page-header">
              <h1>Ulmo Editor <small>v0.1.0</small></h1>
            </div>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col xs={6} md={4}>
            <TilePalette onTileSelected={this.tileSelected} />
          </Col>
          <Col xs={12} md={8}>
            <MapEditor selectedTile={this.state.selectedTile} />
          </Col>
        </Row>
      </Grid>
    );
  }
});

module.exports = Main;
