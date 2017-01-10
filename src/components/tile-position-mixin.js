import { tileSize } from '../config';

/* =============================================================================
 * MIXIN: TILE POSITION
 * =============================================================================
 */
const tilePositionMixin = {
  /* Returns a tile position relative to the tile canvas */
  getCurrentTilePosition: function(evt) {
    var x;
    var y;
    if (evt.pageX === undefined || evt.pageY === undefined) {
      x = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    else {
      x = evt.pageX;
      y = evt.pageY;
    }
    var cvsElement = evt.target;
    var containerElement = cvsElement.parentElement;
    var cvsOffsetLeft = cvsElement.offsetLeft + cvsElement.offsetParent.offsetLeft - containerElement.scrollLeft;
    var cvsOffsetTop = cvsElement.offsetTop + cvsElement.offsetParent.offsetTop - containerElement.scrollTop;
    // console.log(x + "," + y + " :: " + canvasElement.offsetLeft + "," +
    //    canvasElement.offsetTop + " :: " + canvasElement.offsetParent );
    x = Math.max(Math.min(x - cvsOffsetLeft, cvsElement.width), 0);
    y = Math.max(Math.min(y - cvsOffsetTop, cvsElement.height), 0);
    return { x: Math.floor(x / tileSize), y: Math.floor(y / tileSize)};
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
    var x;
    var y;
    if (evt.pageX === undefined || evt.pageY === undefined) {
      x = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    else {
      x = evt.pageX;
      y = evt.pageY;
    }
    return { x: x + 1, y: y };
  }
};

export default tilePositionMixin;
