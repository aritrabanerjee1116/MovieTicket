const movieModel = require("../models/movie");
const statuscode = require("../utils/httpstatuscode");

class movieController {
  async createMovie(req, res) {
    try {
      const {
        title,
        description,
        genre,
        cast,
        releaseDate,
        certificate,
        language,
        duration,
      } = req.body;
      if (
        !title ||
        !description ||
        !genre ||
        !cast ||
        !releaseDate ||
        !certificate ||
        !language ||
        !duration
      ) {
        return res.status(statuscode.BAD_REQUEST).json({
          success: false,
          message: "all feilds are required",
        });
      }
      const exist = await movieModel.findOne({ title });
      if (exist) {
        return res.status(statuscode.BAD_REQUEST).json({
          success: false,
          message: "already exist this movie",
        });
      }
      const createMovie = await movieModel.create({
        title,
        description,
        genre,
        cast,
        releaseDate,
        certificate,
        language,
        duration,
      });
      return res.status(statuscode.CREATED).json({
        success: true,
        message: "Movie is created successfully",
        data: createMovie,
      });
    } catch (error) {
      console.log("hello", error);
      return res.status(statuscode.SERVER_ERROR).json({
        success: false,
        message: "internal server",
      });
    }
  }
  //get all movie
  async getAllmovie(req, res) {
    try {
      const movie = await movieModel.find();
      if (!movie && movie.length) {
        return res.status(statuscode.NOT_FOUND).json({
          success: false,
          message: "no movie is found",
        });
      }
      return res.status(statuscode.OK).json({
        success: true,
        message: "all movies are showing",
        data: movie,
        length: movie.length,
      });
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        success: false,
        message: "internal server",
      });
    }
  }
  //get movie by id
  async movieById(req, res) {
    try {
      const id = req.params.id;
      const movie = await movieModel.findById(id);
      if (!movie) {
        return res.status(statuscode.NOT_FOUND).json({
          success: flase,
          message: "movie not found",
        });
      }
      return res.status(statuscode.OK).json({
        success: true,
        message: "movie is showing",
        data: movie,
      });
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        success: false,
        message: "server error",
      });
    }
  }
  //update movie
  async updateMovie(req, res) {
    try {
      const id = req.params.id;
      const {
        title,
        description,
        genre,
        cast,
        releaseDate,
        certificate,
        language,
        duration,
      } = req.body;
      const movie = await movieModel.findByIdAndUpdate(
        id,
        {
          title,
          description,
          genre,
          cast,
          releaseDate,
          certificate,
          language,
          duration,
        },
        { new: true },
      );
      if (!movie) {
        return res.status(statuscode.NOT_FOUND).json({
          success: false,
          message: "movie not found",
        });
      }
      return res.status(statuscode.OK).json({
        success: true,
        message: "movie is updated",
        data: movie,
      });
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        success: false,
        message: "server error",
      });
    }
  }
  // delete movie
  async deleteMovie(req, res) {
    try {
      const id = req.params.id;
      const movie = await movieModel.findByIdAndDelete(id);
      if (!movie) {
        return res.status(statuscode.NOT_FOUND).json({
          success: false,
          message: "movie not found",
        });
      }
      return res.status(statuscode.OK).json({
        success: true,
        message: "movie is deleted ",
        data : movie
      })
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        success: false,
        message: "server error",
      });
    }
  }
}
module.exports = new movieController();
