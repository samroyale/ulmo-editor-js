const tileSize = require('../config.js').tileSize;

/* =============================================================================
 * MIXIN: TILE POSITION
 * =============================================================================
 */
const tilePositionMixin = {
  /* Returns a tile position relative to the tile canvas */
  getCurrentTilePosition: function(evt) {
    var x;
    var y;
    if (evt.pageX == undefined || evt.pageY == undefined) {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    else {
      x = evt.pageX;
      y = evt.pageY;
    }
    var cvsElement = evt.target;
    var cvsOffsetLeft = cvsElement.offsetLeft + cvsElement.offsetParent.offsetLeft;
    var cvsOffsetTop = cvsElement.offsetTop + cvsElement.offsetParent.offsetTop;
    // console.log(x + "," + y + " :: " + canvasElement.offsetLeft + "," + canvasElement.offsetTop + " :: " + canvasElement.offsetParent );
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
    if (evt.pageX == undefined || evt.pageY == undefined) {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    else {
      x = evt.pageX;
      y = evt.pageY;
    }
    return { x: x + 1, y };
  },

  /* Returns a tile highlight canvas */
  initTileHighlight: function() {
    return this.initHighlight(1, 1);
  },

  initHighlight: function(rows, cols) {
    // console.log(rows + ", " + cols);
    var highlightCanvas = document.createElement("canvas");
    highlightCanvas.width = tileSize * cols;
    highlightCanvas.height = tileSize * rows;
    var ctx = highlightCanvas.getContext('2d');
    // transparent rect
    ctx.beginPath();
    ctx.rect(0, 0, highlightCanvas.width, highlightCanvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fill();
    ctx.closePath();
    // white border
    ctx.beginPath();
    ctx.rect(0, 0, tileSize * cols, 2);
    ctx.rect(0, tileSize * rows - 2, tileSize * cols, 2);
    ctx.rect(0, 0, 2, tileSize * rows);
    ctx.rect(tileSize * cols - 2, 0, 2, tileSize * rows);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    return highlightCanvas;
  }
};

module.exports = tilePositionMixin;
