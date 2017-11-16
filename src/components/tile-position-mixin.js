import { tileSize } from '../config';

/* =============================================================================
 * MIXIN: TILE POSITION
 * =============================================================================
 */
const tilePositionMixin = {
  getRelativePosition: function(evt) {
    var x = evt.pageX;
    var y = evt.pageY;
    if (x === undefined || y === undefined) {
      x = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    var containerElement = evt.target.parentElement;
    var offsetLeft = containerElement.offsetLeft + containerElement.offsetParent.offsetLeft - containerElement.scrollLeft;
    var offsetTop = containerElement.offsetTop + containerElement.offsetParent.offsetTop - containerElement.scrollTop;
    return { x: x - offsetLeft, y: y - offsetTop};
  },

  /* Returns a tile position relative to the tile canvas */
  getCurrentTilePosition: function(evt, canvas) {
    var {x, y} = this.getRelativePosition(evt);
    var cvsElement = canvas ? canvas : evt.target;
    x = Math.max(Math.min(x, cvsElement.width), 0);
    y = Math.max(Math.min(y, cvsElement.height), 0);
    return { x: Math.floor(x / tileSize), y: Math.floor(y / tileSize) };
  },

  /* Returns true if the tile position is within the bounds of the canvas */
  isTilePositionWithinCanvas: function(evt, canvas) {
    var {x, y} = this.getRelativePosition(evt);
    var cvsElement = canvas ? canvas : evt.target;
    return x >= 0 && x < cvsElement.width && y >= 0 && y < cvsElement.height;
  },
};

export default tilePositionMixin;
