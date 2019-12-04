/* tslint:disable */
/**
*/
export class MapEvent {
  free(): void;
/**
* @param {number} event_type 
* @param {number} value 
* @returns {MapEvent} 
*/
  static new(event_type: number, value: number): MapEvent;
/**
* @returns {number} 
*/
  get_event_type(): number;
/**
* @returns {number} 
*/
  get_value(): number;
}
/**
*/
export class MapTile {
  free(): void;
}
/**
*/
export class MoveResult {
  free(): void;
/**
* @param {boolean} valid 
* @param {number} deferral 
* @param {number} level 
* @param {number} mx 
* @param {number} my 
* @returns {MoveResult} 
*/
  static new(valid: boolean, deferral: number, level: number, mx: number, my: number): MoveResult;
/**
* @returns {boolean} 
*/
  is_valid(): boolean;
/**
* @returns {number} 
*/
  get_deferral(): number;
/**
* @returns {number} 
*/
  get_level(): number;
/**
* @returns {number} 
*/
  get_mx(): number;
/**
* @returns {number} 
*/
  get_my(): number;
}
/**
*/
export class PlayMap {
  free(): void;
/**
* @param {any} val 
* @returns {PlayMap} 
*/
  static from_js_data(val: any): PlayMap;
/**
* @param {number} mx 
* @param {number} my 
* @param {number} level 
* @param {Rect} base_rect 
* @returns {MoveResult} 
*/
  apply_move(mx: number, my: number, level: number, base_rect: Rect): MoveResult;
/**
* @param {number} level 
* @param {Rect} base_rect 
* @returns {MapEvent} 
*/
  get_event(level: number, base_rect: Rect): MapEvent;
/**
* @param {number} tx 
* @param {number} ty 
* @param {number} level 
*/
  add_level_to_tile(tx: number, ty: number, level: number): void;
/**
* @param {number} tx 
* @param {number} ty 
*/
  rollback_tile(tx: number, ty: number): void;
/**
* @param {Rect} rect 
* @param {number} z 
* @param {number} level 
* @param {boolean} upright 
* @returns {any} 
*/
  get_js_sprite_masks(rect: Rect, z: number, level: number, upright: boolean): any;
}
/**
*/
export class Rect {
  free(): void;
/**
* @param {number} x 
* @param {number} y 
* @param {number} width 
* @param {number} height 
* @returns {Rect} 
*/
  static new(x: number, y: number, width: number, height: number): Rect;
/**
* @returns {number} 
*/
  get_x(): number;
/**
* @returns {number} 
*/
  get_y(): number;
/**
* @returns {number} 
*/
  get_width(): number;
/**
* @returns {number} 
*/
  get_height(): number;
}
