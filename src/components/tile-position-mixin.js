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
  getCurrentTilePosition: function(evt) {
    var {x, y} = this.getRelativePosition(evt);
    var cvsElement = evt.target;
    x = Math.max(Math.min(x, cvsElement.width), 0);
    y = Math.max(Math.min(y, cvsElement.height), 0);
    return { x: Math.floor(x / tileSize), y: Math.floor(y / tileSize) };
  },

  /* Operates on the css select overlay (hence the canvas element is the previous sibling) */
  isTilePositionWithinBounds: function(evt) {
    var {x, y} = this.getRelativePosition(evt);
    var cvsElement = evt.target.previousSibling;
    console.log(x + ',' + y + ' :: ' + cvsElement.width + ',' + cvsElement.height);
    if (x < 0 || x >= cvsElement.width || y < 0 || y >= cvsElement.height) {
      return false;
    }
    return true;
  },

  /*getOverlayPosition: function(evt, tilePosition) {
    var cvsElement = evt.target;
    var cvsOffsetLeft = cvsElement.offsetLeft + cvsElement.offsetParent.offsetLeft;
    var cvsOffsetTop = cvsElement.offsetTop + cvsElement.offsetParent.offsetTop;
    var x = tilePosition.x * tileSize + cvsOffsetLeft;
    var y = tilePosition.y * tileSize + cvsOffsetTop;
    return { x, y };
  },*/
  getOverlayPosition: function(evt) {
    var x = evt.pageX;
    var y = evt.pageY;
    if (x === undefined || y === undefined) {
      x = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return { x: x + 1, y: y };
  }
};

export default tilePositionMixin;
