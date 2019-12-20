import React from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import TilePalette from './TilePalette';
import MapEditor from './MapEditor';
import './App.css';
import WasmTest from "./WasmTest";

/* =============================================================================
 * COMPONENT: MAIN
 * =============================================================================
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            testWasm: false
        };
    }

    toggleTestWasm = () => this.setState({ testWasm: !this.state.testWasm });

    render = () => {
        const { testWasm } = this.state;
        return (
            testWasm ? (
                <WasmTest />
            ) : (
                <Grid>
                    <Row>
                        <Col lg={12}>
                            <PageHeader className="app-header">Ulmo Editor <small>v0.5.0</small></PageHeader>
                        </Col>
                    </Row>
                    <Home onTestWasm={this.toggleTestWasm} />
                </Grid>
            )
        );
    };
}

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
        const { onTestWasm } = this.props;
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
                        onTestWasm={onTestWasm}
                    />
                </Col>
            </Row>
        );
    };
}

export default App;
