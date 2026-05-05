const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  video: String,
  genre: String
});

module.exports = mongoose.model("Movie", movieSchema);