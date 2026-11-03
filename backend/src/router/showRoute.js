const express = require("express");
const router = express.Router();

const ShowController = require("../controller/showController");

router.post("/", ShowController.createShow);

router.get("/", ShowController.getAllShows);

router.get("/:id", ShowController.getShowById);

router.patch("/:id", ShowController.updateShow);

router.delete("/:id", ShowController.deleteShow);

module.exports = router;