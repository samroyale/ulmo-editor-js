var config = require('./config.js');

const tileSize = config.tileSize;

module.exports = {
  getScalableDrawingContext: function(canvas) {
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    return context;
  },

  drawTile: function(maskTiles, baseTileCanvas) {
    var tileCanvas = document.createElement("canvas");
    tileCanvas.width = tileSize;
    tileCanvas.height = tileSize;
    var ctx = tileCanvas.getContext('2d');
    if (baseTileCanvas) {
      ctx.drawImage(baseTileCanvas, 0, 0);
    }
    maskTiles.forEach(maskTile => {
      ctx.drawImage(maskTile.getTile().getCanvas(), 0, 0);
    });
    return tileCanvas;
  }
}
