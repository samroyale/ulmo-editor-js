var React = require('react');
var Bootstrap = require('react-bootstrap');
var TilePalette = require('./tile-palette.jsx');
var MapEditor = require('./map-editor.jsx');

var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var PageHeader = Bootstrap.PageHeader;

// var Navigation = require('./navigation.jsx');

/*var Main = React.createClass({
    render: function () {
        return (
            <div>
                <Navigation projectName="react-bootstrap-starter" />

                <div className="container">
                    <div className="starter-template">
                        <h1>Bootstrap starter template</h1>
                        <p className="lead">Use this document as a way to quickly start any new project.
                            <br />
                        All you get is this text and a mostly barebones HTML document.</p>
                    </div>
                </div>
            </div>
        );
    }
});*/

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
            <PageHeader>Ulmo Editor</PageHeader>
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
