/* tslint:disable */
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
* @param {Rect} base_rect 
* @returns {MoveResult} 
*/
  static new(valid: boolean, deferral: number, level: number, base_rect: Rect): MoveResult;
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
* @returns {Rect} 
*/
  get_rect(): Rect;
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
