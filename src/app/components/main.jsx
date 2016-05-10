var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    TilePalette = require('./tile-palette.jsx'),
    MapEditor = require('./map-editor.jsx');

var Grid = Bootstrap.Grid,
    Row = Bootstrap.Row,
    Col = Bootstrap.Col,
    PageHeader = Bootstrap.PageHeader;

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
          <Col lg="12">
            <PageHeader className="my-page-header">
              Ulmo Editor <small>v0.1.0</small>
            </PageHeader>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col lg="4">
            <TilePalette onTileSelected={this.tileSelected} />
          </Col>
          <Col lg="8">
            <MapEditor selectedTile={this.state.selectedTile} />
          </Col>
        </Row>
      </Grid>
    );
  }
});

module.exports = Main;
