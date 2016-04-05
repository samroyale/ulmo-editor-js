var tileSize = require('../config.js').tileSize;

/* =============================================================================
 * MIXIN: TILE POSITION
 * =============================================================================
 */
const tilePositionMixin = {
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
    return { 'x': Math.floor(x / tileSize), 'y': Math.floor(y / tileSize)};
  },

  /* Returns a tile highlight canvas */
  initTileHighlight: function() {
    var highlightCanvas = document.createElement("canvas");
    highlightCanvas.width = tileSize;
    highlightCanvas.height = tileSize;
    var ctx = highlightCanvas.getContext('2d');
    // transparent rect
    ctx.beginPath();
    ctx.rect(0, 0, tileSize, tileSize);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fill();
    ctx.closePath();
    // white border
    ctx.beginPath();
    ctx.rect(0, 0, tileSize, 2);
    ctx.rect(0, tileSize - 2, tileSize, 2);
    ctx.rect(0, 0, 2, tileSize);
    ctx.rect(tileSize - 2, 0, 2, tileSize);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    return highlightCanvas;
  }
};

module.exports = tilePositionMixin;
