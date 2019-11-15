import React, { useState } from 'react';
import './App.css';

const formatResult = result => {
    let rect = result.get_rect();
    return `Result { valid: ${result.is_valid()}, deferral: ${result.get_deferral()}, level: ${result.get_level()}, rect: Rect { x: ${rect.get_x()}, y: ${rect.get_y()}, width: ${rect.get_width()}, height: ${rect.get_height()} } }\n`;
};

const testWasm = ({ PlayMap, Rect }) => {
    const playMap = PlayMap.from_js_data({
        rows: 4,
        cols: 3,
        tile_data: [{
            levels:[4],
            down_levels:[],
            special_levels:[]
        }, {
            levels:[],
            down_levels:[],
            special_levels:[4]
        }, {
            levels:[4],
            down_levels:[],
            special_levels:[]
        }, {
            levels:[],
            down_levels:[],
            special_levels:[]
        }, {
            levels:[],
            down_levels:[],
            special_levels:[3]
        }, {
            levels:[],
            down_levels:[],
            special_levels:[]
        }, {
            levels:[2],
            down_levels:[],
            special_levels:[]
        }, {
            levels:[],
            down_levels:[],
            special_levels:[3]
        }, {
            levels:[2],
            down_levels:[],
            special_levels:[]
        }, {
            levels:[2],
            down_levels:[],
            special_levels:[]
        }, {
            levels:[],
            down_levels:[],
            special_levels:[2]
        }, {
            levels:[2],
            down_levels:[],
            special_levels:[]
        }],
        tile_size: 16
    });
    console.log("HELLO " + playMap);

    let results = "";

    // valid
    let result = playMap.apply_move(0, 0, 4, Rect.new(4, 2, 16, 8));
    results += formatResult(result);

    // shuffle
    result = playMap.apply_move(2, 0, 4, Rect.new(0, 12, 16, 8));
    results += formatResult(result);

    // slide
    result = playMap.apply_move(2, 2, 2, Rect.new(0, 44, 16, 8));
    results += formatResult(result);

    // invalid
    result = playMap.apply_move(2, 0, 2, Rect.new(0, 34, 16, 8));
    results += formatResult(result);

    console.log(results);
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
            // const wasm = await import('hello-wasm');
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
