module.exports = {
  getScalableDrawingContext: function(canvas) {
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    return context;
  }
}
