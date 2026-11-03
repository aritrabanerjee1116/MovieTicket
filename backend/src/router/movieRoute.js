const express = require("express")
const movieController = require("../controller/movieController")
const route = express.Router()
route.post("/movie/create", movieController.createMovie)
route.get("/movie", movieController.getAllmovie)
route.get("/movie/:id", movieController.movieById)
route.put("/movie/:id", movieController.updateMovie)
route.delete("/movie/:id", movieController.deleteMovie)

module.exports = route