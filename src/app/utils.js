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
  },

  initTile: function(colour) {
    var emptyCanvas = document.createElement("canvas");
    emptyCanvas.width = tileSize;
    emptyCanvas.height = tileSize;
    var ctx = emptyCanvas.getContext('2d');
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, tileSize, tileSize);
    return emptyCanvas;
  },

  initTileHighlight: function() {
    return module.exports.initHighlight(1, 1);
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
    // white border, 2px thick
    ctx.beginPath();
    ctx.rect(0, 0, tileSize * cols, 2);
    ctx.rect(0, tileSize * rows - 2, tileSize * cols, 2);
    ctx.rect(0, 0, 2, tileSize * rows);
    ctx.rect(tileSize * cols - 2, 0, 2, tileSize * rows);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    return highlightCanvas;
  },

  initAddSuffix: function() {
    // console.log(rows + ", " + cols);
    var addSuffixCanvas = document.createElement("canvas");
    addSuffixCanvas.width = 10;
    addSuffixCanvas.height = 10;
    var ctx = addSuffixCanvas.getContext('2d');
    // transparent rect
    ctx.beginPath();
    ctx.rect(0, 0, addSuffixCanvas.width, addSuffixCanvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fill();
    ctx.closePath();
    // white outline
    ctx.beginPath();
    ctx.rect(3, 0, 4, 10);
    ctx.rect(0, 3, 10, 4);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    // black inner
    ctx.beginPath();
    ctx.rect(4, 1, 2, 8);
    ctx.rect(1, 4, 8, 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
    return addSuffixCanvas;
  }
}
