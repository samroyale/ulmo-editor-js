// app/model/schema.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function xyValidator(value) {
  return value.length == 2;
}

var tileSchema = new mongoose.Schema({
  xy: {type: [Number], required: true, validate: xyValidator},
  name: {type: String, required: true}
}, {_id: false});

var tileSetSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true, unique: true, dropDups: true},
  imageUrl: {type: String, required: true},
  tiles: [tileSchema]
});

var maskTileSchema = new mongoose.Schema({
  tileSet: {type: String, required: true},
  tile: {type: String, required: true},
  maskLevel: String
}, {_id: false});

var mapTileSchema = new mongoose.Schema({
  xy: {type: [Number], required: true, validate: xyValidator},
  tiles: [maskTileSchema],
  levels: [String],
}, {_id: false});

var rpgMapSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true, unique: true, dropDups: true},
  rows: {type: Number, required: true, min: 0},
  cols: {type: Number, required: true, min: 0},
  mapTiles: [mapTileSchema]
});

/*movieSchema.statics.findByTitle = function(title, callback) {
  return this.find({ title: new RegExp(title, 'i') }, callback);
}*/

module.exports = {
  TileSet: mongoose.model('TileSet', tileSetSchema),
  RpgMap: mongoose.model('RpgMap', rpgMapSchema)
};
