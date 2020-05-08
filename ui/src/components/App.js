import React from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import TilePalette from './TilePalette';
import MapEditor from './MapEditor';
import './App.css';

/* =============================================================================
 * COMPONENT: MAIN
 * =============================================================================
 */
const App = () => {
    return (
        <Grid>
            <Row>
                <Col lg={12}>
                    <PageHeader className="app-header">Ulmo Editor <small>v0.5.0</small></PageHeader>
                </Col>
            </Row>
            <Home />
        </Grid>
    );
};

/* =============================================================================
 * COMPONENT: EDITOR VIEW
 * =============================================================================
 */
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTile: null,
            tileControlMode: null
        };
    }

    tileSelected = tile => {
        const { tileControlMode } = this.state;
        const newTileControlMode = tileControlMode ? tileControlMode : "INSERT";
        this.setState({
            selectedTile: tile,
            tileControlMode: newTileControlMode
        });
    };

    setTileControlMode = mode => this.setState({ tileControlMode: mode });

    render = () => {
        const { selectedTile, tileControlMode } = this.state;
        return (
            <Row>
                <Col className="tile-palette-col" lg={4}>
                    <TilePalette
                        onTileSelected={this.tileSelected} />
                </Col>
                <Col className="map-editor-col" lg={8}>
                    <MapEditor
                        selectedTile={selectedTile}
                        tileControlMode={tileControlMode}
                        onSetTileControlMode={this.setTileControlMode}
                    />
                </Col>
            </Row>
        );
    };
}

export default App;
