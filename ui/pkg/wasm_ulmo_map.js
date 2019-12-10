import * as wasm from './wasm_ulmo_map_bg.wasm';

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

let passStringToWasm;
if (typeof cachedTextEncoder.encodeInto === 'function') {
    passStringToWasm = function(arg) {


        let size = arg.length;
        let ptr = wasm.__wbindgen_malloc(size);
        let offset = 0;
        {
            const mem = getUint8Memory();
            for (; offset < arg.length; offset++) {
                const code = arg.charCodeAt(offset);
                if (code > 0x7F) break;
                mem[ptr + offset] = code;
            }
        }

        if (offset !== arg.length) {
            arg = arg.slice(offset);
            ptr = wasm.__wbindgen_realloc(ptr, size, size = offset + arg.length * 3);
            const view = getUint8Memory().subarray(ptr + offset, ptr + size);
            const ret = cachedTextEncoder.encodeInto(arg, view);

            offset += ret.written;
        }
        WASM_VECTOR_LEN = offset;
        return ptr;
    };
} else {
    passStringToWasm = function(arg) {


        let size = arg.length;
        let ptr = wasm.__wbindgen_malloc(size);
        let offset = 0;
        {
            const mem = getUint8Memory();
            for (; offset < arg.length; offset++) {
                const code = arg.charCodeAt(offset);
                if (code > 0x7F) break;
                mem[ptr + offset] = code;
            }
        }

        if (offset !== arg.length) {
            const buf = cachedTextEncoder.encode(arg.slice(offset));
            ptr = wasm.__wbindgen_realloc(ptr, size, size = offset + buf.length);
            getUint8Memory().set(buf, ptr + offset);
            offset += buf.length;
        }
        WASM_VECTOR_LEN = offset;
        return ptr;
    };
}

let cachegetInt32Memory = null;
function getInt32Memory() {
    if (cachegetInt32Memory === null || cachegetInt32Memory.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory;
}
/**
*/
export class MoveResult {

    static __wrap(ptr) {
        const obj = Object.create(MoveResult.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_moveresult_free(ptr);
    }
    /**
    * @returns {boolean}
    */
    get valid() {
        const ret = wasm.__wbg_get_moveresult_valid(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    get deferral() {
        const ret = wasm.__wbg_get_moveresult_deferral(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get level() {
        const ret = wasm.__wbg_get_moveresult_level(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get mx() {
        const ret = wasm.__wbg_get_moveresult_mx(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get my() {
        const ret = wasm.__wbg_get_moveresult_my(this.ptr);
        return ret;
    }
}
/**
*/
export class WasmPlayMap {

    static __wrap(ptr) {
        const obj = Object.create(WasmPlayMap.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_wasmplaymap_free(ptr);
    }
    /**
    * @param {any} val
    * @returns {WasmPlayMap}
    */
    constructor(val) {
        try {
            const ret = wasm.wasmplaymap_from_js_data(addBorrowedObject(val));
            return WasmPlayMap.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {number} mx
    * @param {number} my
    * @param {number} level
    * @param {WasmRect} base_rect
    * @returns {MoveResult}
    */
    applyMove(mx, my, level, base_rect) {
        _assertClass(base_rect, WasmRect);
        const ptr0 = base_rect.ptr;
        base_rect.ptr = 0;
        const ret = wasm.wasmplaymap_applyMove(this.ptr, mx, my, level, ptr0);
        return MoveResult.__wrap(ret);
    }
    /**
    * @param {number} tx
    * @param {number} ty
    * @param {number} level
    */
    addLevelToTile(tx, ty, level) {
        wasm.wasmplaymap_addLevelToTile(this.ptr, tx, ty, level);
    }
    /**
    * @param {number} tx
    * @param {number} ty
    */
    rollbackTile(tx, ty) {
        wasm.wasmplaymap_rollbackTile(this.ptr, tx, ty);
    }
    /**
    * @param {number} level
    * @param {WasmRect} base_rect
    * @returns {any}
    */
    getEvent(level, base_rect) {
        _assertClass(base_rect, WasmRect);
        const ptr0 = base_rect.ptr;
        base_rect.ptr = 0;
        const ret = wasm.wasmplaymap_getEvent(this.ptr, level, ptr0);
        return takeObject(ret);
    }
    /**
    * @param {WasmRect} rect
    * @param {number} z
    * @param {number} level
    * @param {boolean} upright
    * @returns {any}
    */
    getSpriteMasks(rect, z, level, upright) {
        _assertClass(rect, WasmRect);
        const ptr0 = rect.ptr;
        rect.ptr = 0;
        const ret = wasm.wasmplaymap_getSpriteMasks(this.ptr, ptr0, z, level, upright);
        return takeObject(ret);
    }
}
/**
*/
export class WasmRect {

    static __wrap(ptr) {
        const obj = Object.create(WasmRect.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_wasmrect_free(ptr);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} width
    * @param {number} height
    * @returns {WasmRect}
    */
    constructor(x, y, width, height) {
        const ret = wasm.wasmrect_new(x, y, width, height);
        return WasmRect.__wrap(ret);
    }
}

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm(arg0, arg1);
    return addHeapObject(ret);
};

export const __wbindgen_json_parse = function(arg0, arg1) {
    const ret = JSON.parse(getStringFromWasm(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbindgen_json_serialize = function(arg0, arg1) {
    const ret = JSON.stringify(getObject(arg1));
    const ret0 = passStringToWasm(ret);
    const ret1 = WASM_VECTOR_LEN;
    getInt32Memory()[arg0 / 4 + 0] = ret0;
    getInt32Memory()[arg0 / 4 + 1] = ret1;
};

export const __widl_f_log_1_ = function(arg0) {
    console.log(getObject(arg0));
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm(arg0, arg1));
};

