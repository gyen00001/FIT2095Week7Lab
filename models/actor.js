const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  bYear: {
    validate: {
      validator: Number.isInteger,
      message: "Birth year should be integer",
    },
    type: Number,
    required: true,
  },
  // define the list of movies, which is an array of references (i.e. ids) to ‘Movie’ collection
  movies: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Movie",
    },
  ],
});

module.exports = mongoose.model("Actor", actorSchema);
