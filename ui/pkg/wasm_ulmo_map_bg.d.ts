/* tslint:disable */
export const memory: WebAssembly.Memory;
export function __wbg_rect_free(a: number): void;
export function rect_new(a: number, b: number, c: number, d: number): number;
export function rect_get_x(a: number): number;
export function rect_get_y(a: number): number;
export function rect_get_width(a: number): number;
export function rect_get_height(a: number): number;
export function __wbg_maptile_free(a: number): void;
export function __wbg_moveresult_free(a: number): void;
export function moveresult_new(a: number, b: number, c: number, d: number, e: number): number;
export function moveresult_is_valid(a: number): number;
export function moveresult_get_deferral(a: number): number;
export function moveresult_get_level(a: number): number;
export function moveresult_get_mx(a: number): number;
export function moveresult_get_my(a: number): number;
export function __wbg_mapevent_free(a: number): void;
export function mapevent_new(a: number, b: number): number;
export function mapevent_get_event_type(a: number): number;
export function mapevent_get_value(a: number): number;
export function __wbg_playmap_free(a: number): void;
export function playmap_from_js_data(a: number): number;
export function playmap_apply_move(a: number, b: number, c: number, d: number, e: number): number;
export function playmap_get_event(a: number, b: number, c: number): number;
export function playmap_add_level_to_tile(a: number, b: number, c: number, d: number): void;
export function playmap_rollback_tile(a: number, b: number, c: number): void;
export function playmap_get_js_sprite_masks(a: number, b: number, c: number, d: number, e: number): number;
export function __wbindgen_malloc(a: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number): number;
