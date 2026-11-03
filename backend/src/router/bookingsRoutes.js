const express = require("express");
const router = express.Router();

const BookingController = require("../controller/bookingController");
const verifyToken = require("../middleware/authMiddleware");

// Create booking
router.post("/", verifyToken.verifyToken, BookingController.createBooking);

// User booking history — keep this before /:id
router.get("/my-bookings", verifyToken.verifyToken, BookingController.getMyBookings);

// Get all bookings
router.get("/", verifyToken.verifyToken, BookingController.getAllBookings);

// Get booking by ID
router.get("/:id", verifyToken.verifyToken, BookingController.getBookingById);

// Cancel booking
router.patch("/:id/cancel", verifyToken.verifyToken, BookingController.cancelBooking);

module.exports = router;