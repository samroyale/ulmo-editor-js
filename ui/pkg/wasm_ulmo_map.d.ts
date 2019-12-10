/* tslint:disable */
/**
*/
export class MoveResult {
  free(): void;
  readonly deferral: number;
  readonly level: number;
  readonly mx: number;
  readonly my: number;
  readonly valid: boolean;
}
/**
*/
export class WasmPlayMap {
  free(): void;
/**
* @param {any} val 
* @returns {WasmPlayMap} 
*/
  constructor(val: any);
/**
* @param {number} mx 
* @param {number} my 
* @param {number} level 
* @param {WasmRect} base_rect 
* @returns {MoveResult} 
*/
  applyMove(mx: number, my: number, level: number, base_rect: WasmRect): MoveResult;
/**
* @param {number} tx 
* @param {number} ty 
* @param {number} level 
*/
  addLevelToTile(tx: number, ty: number, level: number): void;
/**
* @param {number} tx 
* @param {number} ty 
*/
  rollbackTile(tx: number, ty: number): void;
/**
* @param {number} level 
* @param {WasmRect} base_rect 
* @returns {any} 
*/
  getEvent(level: number, base_rect: WasmRect): any;
/**
* @param {WasmRect} rect 
* @param {number} z 
* @param {number} level 
* @param {boolean} upright 
* @returns {any} 
*/
  getSpriteMasks(rect: WasmRect, z: number, level: number, upright: boolean): any;
}
/**
*/
export class WasmRect {
  free(): void;
/**
* @param {number} x 
* @param {number} y 
* @param {number} width 
* @param {number} height 
* @returns {WasmRect} 
*/
  constructor(x: number, y: number, width: number, height: number);
}
