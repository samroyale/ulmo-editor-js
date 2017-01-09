import { tileSize } from './config';

export function getDrawingContext(canvas) {
  var context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  return context;
};

export function drawTile(maskTiles, baseTileCanvas) {
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
};

export function initTile(colour) {
  var emptyCanvas = document.createElement("canvas");
  emptyCanvas.width = tileSize;
  emptyCanvas.height = tileSize;
  var ctx = emptyCanvas.getContext('2d');
  ctx.fillStyle = colour;
  ctx.fillRect(0, 0, tileSize, tileSize);
  return emptyCanvas;
};

export function initHighlight(rows, cols) {
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
};

export function initTileHighlight() {
  return initHighlight(1, 1);
};

export function loadImage(imageUrl, callback) {
  var image = new Image();
  image.onerror = () => {
    callback({
      err: imageUrl + " failed to load"
    });
  };
  image.onload = () => {
    callback({ img: image });
  };
  //tileSetImage.crossOrigin = "Anonymous"; // CORS
  image.src = imageUrl;
};
