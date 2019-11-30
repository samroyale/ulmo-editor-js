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

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

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

let cachedTextDecoder = new TextDecoder('utf-8');

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
/**
*/
export class MapEvent {

    static __wrap(ptr) {
        const obj = Object.create(MapEvent.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_mapevent_free(ptr);
    }
    /**
    * @param {number} event_type
    * @param {number} value
    * @returns {MapEvent}
    */
    static new(event_type, value) {
        const ret = wasm.mapevent_new(event_type, value);
        return MapEvent.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    get_event_type() {
        const ret = wasm.mapevent_get_event_type(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_value() {
        const ret = wasm.mapevent_get_value(this.ptr);
        return ret;
    }
}
/**
*/
export class MapTile {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_maptile_free(ptr);
    }
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
    * @param {boolean} valid
    * @param {number} deferral
    * @param {number} level
    * @param {number} mx
    * @param {number} my
    * @returns {MoveResult}
    */
    static new(valid, deferral, level, mx, my) {
        const ret = wasm.moveresult_new(valid, deferral, level, mx, my);
        return MoveResult.__wrap(ret);
    }
    /**
    * @returns {boolean}
    */
    is_valid() {
        const ret = wasm.moveresult_is_valid(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    get_deferral() {
        const ret = wasm.moveresult_get_deferral(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_level() {
        const ret = wasm.moveresult_get_level(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_mx() {
        const ret = wasm.moveresult_get_mx(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_my() {
        const ret = wasm.moveresult_get_my(this.ptr);
        return ret;
    }
}
/**
*/
export class PlayMap {

    static __wrap(ptr) {
        const obj = Object.create(PlayMap.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_playmap_free(ptr);
    }
    /**
    * @param {any} val
    * @returns {PlayMap}
    */
    static from_js_data(val) {
        try {
            const ret = wasm.playmap_from_js_data(addBorrowedObject(val));
            return PlayMap.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {number} mx
    * @param {number} my
    * @param {number} level
    * @param {Rect} base_rect
    * @returns {MoveResult}
    */
    apply_move(mx, my, level, base_rect) {
        _assertClass(base_rect, Rect);
        const ptr0 = base_rect.ptr;
        base_rect.ptr = 0;
        const ret = wasm.playmap_apply_move(this.ptr, mx, my, level, ptr0);
        return MoveResult.__wrap(ret);
    }
    /**
    * @param {number} level
    * @param {Rect} base_rect
    * @returns {MapEvent}
    */
    get_event(level, base_rect) {
        _assertClass(base_rect, Rect);
        const ptr0 = base_rect.ptr;
        base_rect.ptr = 0;
        const ret = wasm.playmap_get_event(this.ptr, level, ptr0);
        return MapEvent.__wrap(ret);
    }
    /**
    * @param {number} tx
    * @param {number} ty
    * @param {number} level
    */
    add_level_to_tile(tx, ty, level) {
        wasm.playmap_add_level_to_tile(this.ptr, tx, ty, level);
    }
    /**
    * @param {number} tx
    * @param {number} ty
    */
    rollback_tile(tx, ty) {
        wasm.playmap_rollback_tile(this.ptr, tx, ty);
    }
}
/**
*/
export class Rect {

    static __wrap(ptr) {
        const obj = Object.create(Rect.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_rect_free(ptr);
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} width
    * @param {number} height
    * @returns {Rect}
    */
    static new(x, y, width, height) {
        const ret = wasm.rect_new(x, y, width, height);
        return Rect.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    get_x() {
        const ret = wasm.rect_get_x(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_y() {
        const ret = wasm.rect_get_y(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get_width() {
        const ret = wasm.rect_get_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get_height() {
        const ret = wasm.rect_get_height(this.ptr);
        return ret >>> 0;
    }
}

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbindgen_json_serialize = function(arg0, arg1) {
    const ret = JSON.stringify(getObject(arg1));
    const ret0 = passStringToWasm(ret);
    const ret1 = WASM_VECTOR_LEN;
    getInt32Memory()[arg0 / 4 + 0] = ret0;
    getInt32Memory()[arg0 / 4 + 1] = ret1;
};

export const __wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm(arg0, arg1);
    return addHeapObject(ret);
};

export const __widl_f_log_1_ = function(arg0) {
    console.log(getObject(arg0));
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm(arg0, arg1));
};

