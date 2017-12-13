import { tileSize } from './config';

function ParseLevelException(message) {
  this.name = 'ParseLevelException';
  this.message = message;
}

const strictParseInt = (int, errMessage) => {
  let num = Number.parseInt(int, 10);
  if (isNaN(num)) {
    throw new ParseLevelException(errMessage);
  }
  return num;
};

const strictParseFloat = (float, errMessage) => {
  let num = Number.parseFloat(float);
  if (isNaN(num)) {
    throw new ParseLevelException(errMessage);
  }
  return num;
};

export function errorMessage(message, data) {
  let errorInfo = data.status ? data.status + ": " + data.err : data.err;
  return message + " [" + errorInfo + "]";
}

export function getDrawingContext(canvas) {
  let context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  return context;
};

export function drawTile(maskTiles, baseTileCanvas) {
  let tileCanvas = document.createElement('canvas');
  tileCanvas.width = tileSize;
  tileCanvas.height = tileSize;
  let ctx = tileCanvas.getContext('2d');
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
  let canvas = initTransparentRect(width, height);
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = colour;
  ctx.fillRect(0, 0, width, height);
  return canvas;
}

export function initTransparentRect(width, height) {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  // canvas transparent by default?
  return canvas;
}

export function copyCanvas(canvas) {
  let copy = initTransparentRect(canvas.width, canvas.height);
  let ctx = copy.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
  return copy;
};

export function loadImage(imageUrl, callback) {
  let image = new Image();
  image.onerror = () => {
    callback({
      err: imageUrl + ' failed to load'
    });
  };
  image.onload = () => {
    callback({ img: image });
  };
  //tileSetImage.crossOrigin = "Anonymous"; // CORS
  image.src = imageUrl;
};

export function parseLevel(levelStr) {
  if (levelStr.startsWith('S')) {
    let level = strictParseFloat(levelStr.substr(1),
        'Special level could not be parsed as a float: ' + levelStr);
    if (Number.isInteger(level)) {
      return {
        type: 'special',
        level: level
      }
    }
    return {
      type: 'special',
      level: level,
      high: Math.ceil(level),
      low: Math.floor(level)
    }
  }
  if (levelStr.startsWith('D')) {
    let levels = levelStr.substr(1).split('-');
    if (levels.length !== 2) {
      throw new ParseLevelException(
          'Down level did not have a level and drop component separated by \'-\': ' + levelStr);
    }
    let levelVal = strictParseInt(levels[0],
        'Level component could not be parsed as an int: ' + levels[0]);
    let dropVal = strictParseInt(levels[1],
        'Drop component could not be parsed as an int: ' + levels[1]);
    if (dropVal < 1) {
      throw new ParseLevelException('Drop component was not greater than zero');
    }
    return {
      type: 'down',
      level: levelVal,
      drop: dropVal
    }
  }
  return {
    type: 'standard',
    level: Number.parseInt(levelStr, 10)
  };
};

/* =============================================================================
 * CLASS: RECT
 * =============================================================================
 */
export class Rect {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.left = x;
    this.top = y;
    this._update();
  }

  _update() {
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  }

  move(mx, my) {
    return new Rect(this.left + mx, this.top + my, this.width, this.height);
  }

  copy() {
    return this.move(0, 0);
  }

  moveInPlace(mx, my) {
    this.left += mx;
    this.top += my;
    this._update();
  }

  getTopLeft() {
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

  intersectsWith(rect) {
    if (!rect) {
      return false;
    }
    return (
      (rect.left < this.right) && (rect.top < this.bottom) &&
      (rect.right > this.left) && (rect.bottom > this.top)
    );
  }

  toString() {
    return 'Rect [left: ' + this.left + ', top: ' + this.top + ', width: ' + this.width + ', height: ' + this.height + ']';
  }
};
