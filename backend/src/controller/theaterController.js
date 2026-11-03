const Theater = require("../models/theater");

class TheaterController {

  // Create Theater
  static async createTheater(req, res) {
    try {
      const {
        name,
        location,
        address,
        totalScreens,
        contactNumber
      } = req.body;

      const theater = await Theater.create({
        name,
        location,
        address,
        totalScreens,
        contactNumber
      });

      return res.status(201).json({
        success: true,
        message: "Theater created successfully",
        data: theater
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to create theater"
      });
    }
  }


  // Get All Theaters
  static async getAllTheaters(req, res) {
    try {
      const theaters = await Theater.find();

      return res.status(200).json({
        success: true,
        message: "Theaters fetched successfully",
        data: theaters
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch theaters"
      });
    }
  }


  // Get Theater By ID
  static async getTheaterById(req, res) {
    try {
      const { id } = req.params;

      const theater = await Theater.findById(id);

      if (!theater) {
        return res.status(404).json({
          success: false,
          message: "Theater not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Theater fetched successfully",
        data: theater
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch theater"
      });
    }
  }


  // Update Theater
  static async updateTheater(req, res) {
    try {
      const { id } = req.params;

      const theater = await Theater.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!theater) {
        return res.status(404).json({
          success: false,
          message: "Theater not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Theater updated successfully",
        data: theater
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to update theater"
      });
    }
  }


  // Delete Theater
  static async deleteTheater(req, res) {
    try {
      const { id } = req.params;

      const theater = await Theater.findByIdAndDelete(id);

      if (!theater) {
        return res.status(404).json({
          success: false,
          message: "Theater not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Theater deleted successfully",
        data: theater
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete theater"
      });
    }
  }

}

module.exports = TheaterController;