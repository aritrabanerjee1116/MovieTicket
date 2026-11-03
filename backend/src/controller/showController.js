const Show = require("../models/show");
const Movie = require("../models/movie");
const Theater = require("../models/theater");

class ShowController {

  // Create Show
  static async createShow(req, res) {
    try {
      const {
        movieId,
        theaterId,
        screenNumber,
        showDate,
        startTime,
        endTime,
        totalSeats,
        ticketPrice,
      } = req.body;

      // Check Movie
      const movie = await Movie.findById(movieId);

      if (!movie) {
        return res.status(404).json({
          success: false,
          message: "Movie not found",
        });
      }

      // Check Theater
      const theater = await Theater.findById(theaterId);

      if (!theater) {
        return res.status(404).json({
          success: false,
          message: "Theater not found",
        });
      }

      // Check screen number
      if (screenNumber > theater.totalScreens) {
        return res.status(400).json({
          success: false,
          message: "Invalid screen number for this theater",
        });
      }

      const show = await Show.create({
        movieId,
        theaterId,
        screenNumber,
        showDate,
        startTime,
        endTime,
        totalSeats,
        availableSeats: totalSeats,
        ticketPrice,
      });

      return res.status(201).json({
        success: true,
        message: "Show created successfully",
        data: show,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to create show",
      });
    }
  }


  // Get All Shows
  static async getAllShows(req, res) {
    try {
      const shows = await Show.find()
        .populate("movieId")
        .populate("theaterId");

      return res.status(200).json({
        success: true,
        message: "Shows fetched successfully",
        data: shows,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch shows",
      });
    }
  }


  // Get Show By ID
  static async getShowById(req, res) {
    try {
      const { id } = req.params;

      if (!Show.db.base.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid show ID",
        });
      }

      const show = await Show.findById(id)
        .populate("movieId")
        .populate("theaterId");

      if (!show) {
        return res.status(404).json({
          success: false,
          message: "Show not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Show fetched successfully",
        data: show,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch show",
      });
    }
  }


  // Update Show
  static async updateShow(req, res) {
    try {
      const { id } = req.params;

      if (!Show.db.base.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid show ID",
        });
      }

      const allowedFields = [
        "movieId",
        "theaterId",
        "screenNumber",
        "showDate",
        "startTime",
        "endTime",
        "totalSeats",
        "ticketPrice",
      ];

      const updateData = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      // Check Movie if movieId is updated
      if (updateData.movieId) {
        const movie = await Movie.findById(updateData.movieId);

        if (!movie) {
          return res.status(404).json({
            success: false,
            message: "Movie not found",
          });
        }
      }

      // Check Theater if theaterId is updated
      if (updateData.theaterId) {
        const theater = await Theater.findById(updateData.theaterId);

        if (!theater) {
          return res.status(404).json({
            success: false,
            message: "Theater not found",
          });
        }
      }

      const show = await Show.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("movieId")
        .populate("theaterId");

      if (!show) {
        return res.status(404).json({
          success: false,
          message: "Show not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Show updated successfully",
        data: show,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to update show",
      });
    }
  }


  // Delete Show
  static async deleteShow(req, res) {
    try {
      const { id } = req.params;

      if (!Show.db.base.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid show ID",
        });
      }

      const show = await Show.findByIdAndDelete(id);

      if (!show) {
        return res.status(404).json({
          success: false,
          message: "Show not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Show deleted successfully",
        data: show,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete show",
      });
    }
  }
}

module.exports = ShowController;