const express = require("express")
const AuthMiddleware = require("../middleware/authMiddleware")
const userSchemaValidation = require("../validations/userSchemavalidation")
const userController = require("../controller/userController")
const router = express.Router()
const Validation = require("../validations/index")


router.post("/signup", Validation.validate(userSchemaValidation.signup) , userController.signUp)

//checking for otp 
router.post('/verify', userController.verify)
//login
router.post("/login", Validation.validate(userSchemaValidation.login), userController.login)
//user dashboard
router.post("/user/dashboard", AuthMiddleware.verifyToken, userController.userDashboard)
//user profile fetch
router.get("/user/profile", AuthMiddleware.verifyToken, userController.profileFetch)
//user profile update 
router.put("/user/profile", AuthMiddleware.verifyToken, userController.updateProfile)

module.exports = router