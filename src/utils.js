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
  return initRect(colour, tileSize, tileSize);
};

export function initRect(colour, width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = colour;
  ctx.fillRect(0, 0, width, height);
  return canvas;
}

export function initHighlight(rows, cols) {
  // console.log(rows + ", " + cols);
  var canvas = document.createElement("canvas");
  canvas.width = tileSize * cols;
  canvas.height = tileSize * rows;
  var ctx = canvas.getContext('2d');
  // transparent rect
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
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
  return canvas;
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

export class Rect {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.left = x;
    this.top = y;
    this._update();
  }

  _update() {
    this.right = this.left + this.width - 1;
    this.bottom = this.top + this.height - 1;
  }

  move(mx, my) {
    return new Rect(this.left + mx, this.top + my, this.width, this.height);
  }

  moveInPlace(mx, my) {
    this.left += mx;
    this.top += my;
    this._update();
  }

  getTopleft() {
    return {
      x: this.left,
      y: this.top
    };
  }

  getBottomRight() {
    return {
      x: this.right,
      y: this.bottom
    };
  }
};

Rect.prototype.toString = function rectToString() {
    return 'Rect [left: ' + this.left + ', top: ' + this.top + ', width: ' + this.width + ', height: ' + this.height + ']';
};
