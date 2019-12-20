import React, { useState } from 'react';
import './App.css';

const aPlayMap = WasmPlayMap => {
    return new WasmPlayMap({
        rows: 4,
        cols: 3,
        tileData: [{
            levels: [4],
            downLevels: [],
            specialLevels: [],
            masks: []
        }, {
            levels: [],
            downLevels: [],
            specialLevels: [4],
            masks: []
        }, {
            levels: [4],
            downLevels: [],
            specialLevels: [],
            masks: []
        }, {
            levels: [],
            downLevels: [],
            specialLevels: [],
            masks: []
        }, {
            levels: [],
            downLevels: [],
            specialLevels: [3],
            masks: []
        }, {
            levels: [],
            downLevels: [],
            specialLevels: [],
            masks: []
        }, {
            levels: [2],
            downLevels: [],
            specialLevels: [],
            masks: []
        }, {
            levels: [],
            downLevels: [],
            specialLevels: [3],
            masks: []
        }, {
            levels: [2],
            downLevels: [],
            specialLevels: [],
            masks: []
        }, {
            levels: [2],
            downLevels: [],
            specialLevels: [],
            masks: []
        }, {
            levels: [],
            downLevels: [],
            specialLevels: [2],
            masks: []
        }, {
            levels: [2],
            downLevels: [],
            specialLevels: [],
            masks: []
        }],
        tileSize: 16
    });
};

const formatMoveResult = result => {
    let { valid, deferral, level, mx, my } = result;
    return `MoveResult { valid: ${valid}, deferral: ${deferral}, level: ${level}, mx: ${mx}, my: ${my} }\n`;
};

const runApplyMove = ({ WasmPlayMap, WasmRect }) => {
    const playMap = aPlayMap(WasmPlayMap);

    let results = "";

    // valid
    let result = playMap.applyMove(2, 0, 4, new WasmRect(2, 2, 16, 8));
    results += formatMoveResult(result);

    // diagonal
    result = playMap.applyMove(2, 2, 4, new WasmRect(2, 0, 16, 8));
    results += formatMoveResult(result);

    // shuffle
    result = playMap.applyMove(2, 0, 4, new WasmRect(0, 12, 16, 8));
    results += formatMoveResult(result);

    // slide
    result = playMap.applyMove(2, 2, 2, new WasmRect(0, 44, 16, 8));
    results += formatMoveResult(result);

    // invalid
    result = playMap.applyMove(2, 0, 2, new WasmRect(0, 34, 16, 8));
    results += formatMoveResult(result);

    return results;
};

const testWasm = wasm => {
    let results = [
        runApplyMove(wasm)
        // runGetEvent(wasm),
        // runGetSpriteMasks(wasm)
    ];
    //testResults.textContent = results.join("\n");
    console.log(results.join("\n"));
};

const Loaded = ({ wasm }) => <button onClick={() => testWasm(wasm)}>Test</button>;

const Unloaded = ({ loading, loadWasm }) => {
    return loading ? (
        <div>Loading...</div>
    ) : (
        <button onClick={loadWasm}>Load library</button>
    );
};

const WasmTest = () => {
    const [loading, setLoading] = useState(false);
    const [wasm, setWasm] = useState(null);

    const loadWasm = async () => {
        try {
            setLoading(true);
            const wasm = await import('wasm-ulmo-map');
            setWasm(wasm);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                {wasm ? (
                    <Loaded wasm={wasm} />
                ) : (
                    <Unloaded loading={loading} loadWasm={loadWasm} />
                )}
            </header>
        </div>
    );
};

export default WasmTest;
