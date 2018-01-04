import { tileSize } from '../config';

/* =============================================================================
 * MIXIN: TILE POSITION
 * =============================================================================
 */
const tilePositionMixin = {
  getEventPosition: function(evt) {
    var x = evt.pageX;
    var y = evt.pageY;
    if (x === undefined || y === undefined) {
      x = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return { x: x, y: y }
  },

  getPositionRelativeToCanvas: function(evt, canvas) {
    var {x, y} = this.getEventPosition(evt);
    var containerElement = canvas.parentElement;
    var offsetLeft = containerElement.offsetLeft + containerElement.offsetParent.offsetLeft - containerElement.scrollLeft;
    var offsetTop = containerElement.offsetTop + containerElement.offsetParent.offsetTop - containerElement.scrollTop;
    return { x: x - offsetLeft, y: y - offsetTop };
  },

  getPositionRelativeToCanvasView: function(evt, canvas) {
    var {x, y} = this.getEventPosition(evt);
    var containerElement = canvas.parentElement;
    var offsetLeft = containerElement.offsetLeft + containerElement.offsetParent.offsetLeft;
    var offsetTop = containerElement.offsetTop + containerElement.offsetParent.offsetTop;
    return { x: x - offsetLeft, y: y - offsetTop};
  },

  /* Returns a tile position relative to the tile canvas */
  getCurrentTilePosition: function(evt, canvas) {
    var cvsElement = canvas ? canvas : evt.target;
    var {x, y} = this.getPositionRelativeToCanvas(evt, cvsElement);
    x = Math.max(Math.min(x, cvsElement.width), 0);
    y = Math.max(Math.min(y, cvsElement.height), 0);
    return { x: Math.floor(x / tileSize), y: Math.floor(y / tileSize) };
  },

  /* Returns true if the tile position is within the bounds of the canvas view */
  isTilePositionWithinCanvasView: function(evt, canvas) {
    var cvsElement = canvas ? canvas : evt.target;
    var {x, y} = this.getPositionRelativeToCanvasView(evt, cvsElement);
    var containerElement = cvsElement.parentElement;
    var widthBound = Math.min(cvsElement.width, containerElement.clientWidth);
    var heightBound = Math.min(cvsElement.height, containerElement.clientHeight);
    return x >= 0 && x < widthBound && y >= 0 && y < heightBound;
  },
};

export default tilePositionMixin;
