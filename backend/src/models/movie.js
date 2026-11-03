const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: [String],
      required: true,
    },

    language: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number, // Duration in minutes
      required: true,
      min: 1,
    },

    releaseDate: {
      type: Date,
      required: true,
    },

    cast: {
      type: [String],
      required: true,
    },

    certificate: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const movieModel = mongoose.model("Movie", movieSchema);

module.exports = movieModel;