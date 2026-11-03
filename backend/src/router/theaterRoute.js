const express = require("express");
const router = express.Router();

const TheaterController = require("../controller/theaterController");

router.post("/", TheaterController.createTheater);

router.get("/", TheaterController.getAllTheaters);

router.get("/:id", TheaterController.getTheaterById);

router.patch("/:id", TheaterController.updateTheater);

router.delete("/:id", TheaterController.deleteTheater);

module.exports = router;