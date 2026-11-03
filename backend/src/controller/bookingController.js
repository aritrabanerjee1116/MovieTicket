const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Show = require("../models/show");

// 1. Create Booking
exports.createBooking = async (req, res) => {
  let reservedShow = null;

  try {
    const { showId, numberOfTickets } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(showId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid show ID",
      });
    }

    if (
      !Number.isInteger(numberOfTickets) ||
      numberOfTickets < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Number of tickets must be a positive integer",
      });
    }

    // Atomically reserve seats only if enough seats are available
    reservedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        availableSeats: { $gte: numberOfTickets },
      },
      {
        $inc: { availableSeats: -numberOfTickets },
      },
      { new: true }
    );

    if (!reservedShow) {
      const showExists = await Show.exists({ _id: showId });

      return res.status(showExists ? 400 : 404).json({
        success: false,
        message: showExists
          ? "Not enough seats available"
          : "Show not found",
      });
    }

    const totalAmount =
      reservedShow.ticketPrice * numberOfTickets;

    const booking = await Booking.create({
      userId,
      showId,
      numberOfTickets,
      totalAmount,
      bookingStatus: "confirmed",
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    // Restore seats if booking creation fails after reserving them
    if (reservedShow) {
      await Show.updateOne(
        { _id: reservedShow._id },
        { $inc: { availableSeats: req.body.numberOfTickets } }
      );
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 2. Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "-password -__v")
      .populate({
        path: "showId",
        populate: [
          { path: "movieId" },
          { path: "theaterId" },
        ],
      });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 3. Get Booking By ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      userId: req.user.id,
    })
      .populate("userId", "-password -__v")
      .populate({
        path: "showId",
        populate: [
          { path: "movieId" },
          { path: "theaterId" },
        ],
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 4. Get User Booking History
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id,
    })
      .populate({
        path: "showId",
        populate: [
          { path: "movieId" },
          { path: "theaterId" },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Your booking history fetched successfully",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 5. Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    // Only the booking owner can cancel it.
    // This also prevents restoring seats more than once.
    const booking = await Booking.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
        bookingStatus: "confirmed",
      },
      {
        $set: { bookingStatus: "cancelled" },
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or already cancelled",
      });
    }

    // Restore the seats
    await Show.updateOne(
      { _id: booking.showId },
      { $inc: { availableSeats: booking.numberOfTickets } }
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};