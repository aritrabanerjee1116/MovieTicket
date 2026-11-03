const userModel = require("../models/user");
const statuscode = require("../utils/httpstatuscode");
const Otp=require("../models/otp")
// const transporter = require("../config/mailConfig")
const bcrypt = require("bcryptjs")
const verifyEmailOTP = require("../utils/sendmail")
const jwt = require("jsonwebtoken")

class userController {
  //sign up
  async signUp(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(statuscode.BAD_REQUEST).json({
          success: false,
          message: "All feilds are required ",
        });
      }
      //existing
      const existing = await userModel.findOne({ email });
      if (existing) {
        return res.status(statuscode.BAD_REQUEST).json({
          success: false,
          message: "User already exist ",
        });
      }
      // passowrd hash
      const salt = 10;
      const hashpassword = await bcrypt.hash(password, salt);
      const data = new userModel({
        name: name,
        email: email,
        password: hashpassword,
      });
      const result = await data.save();
      await verifyEmailOTP(req, result);
      return res.status(statuscode.OK).json({
        success: true,
        message: "User created successfully and email sent for verification !!",
        data: {
            name : name ,
            email :email,
        },
      });
    } catch (error) {
        console.log("error hello",error)
      return res.status(401).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  // verify otp section
  async verify(req, res) {
    try {
      const { email, otp } = req.body;
      // Check if all required fields are provided
      if (!email || !otp) {
        return res
          .status(400)
          .json({ status: false, message: "All fields are required" });
      }
      const existingUser = await userModel.findOne({ email });

      // Check if email doesn't exists
      if (!existingUser) {
        return res
          .status(404)
          .json({ status: "failed", message: "user doesn't exists" });
      }

      // Check if email is already verified
      if (existingUser.isVerified) {
        return res
          .status(400)
          .json({ status: false, message: "Email is already verified" });
      }
      // Check if there is a matching email verification OTP
      const emailVerification = await Otp.findOne({
        userId: existingUser._id,
        otp,
      });
      if (!emailVerification) {
        if (!existingUser.isVerified) {
          // console.log(existingUser);
          await verifyEmailOTP(req, existingUser);
          return res
            .status(400)
            .json({
              status: false,
              message: "Invalid OTP, new OTP sent to your email",
            });
        }
        return res.status(400).json({ status: false, message: "Invalid OTP" });
      }
      // Check if OTP is expired
      const currentTime = new Date();
      // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes).
      const expirationTime = new Date(
        emailVerification.createdAt.getTime() + 15 * 60 * 1000,
      );
      if (currentTime > expirationTime) {
        // OTP expired, send new OTP
        await verifyEmailOTP(req, existingUser);
        return res
          .status(400)
          .json({
            status: "failed",
            message: "OTP expired, new OTP sent to your email",
          });
      }
      // OTP is valid and not expired, mark email as verified
      existingUser.isVerified = true;
      await existingUser.save();

      // Delete email verification document
      await Otp.deleteMany({ userId: existingUser._id });
      return res
        .status(200)
        .json({ status: true, message: "Email verified successfully" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          status: false,
          message: "Unable to verify email, please try again later",
        });
    }
  }
  //login
  async login(req, res) {
    try {
      const { email, password } = req.body
      const user = await userModel.findOne({ email })
      if (!user) {
        return res.status(statuscode.BAD_REQUEST).json({
          success: false,
          message : "user not found"
        })
      }
      //comparing password 
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(statuscode.BAD_REQUEST).json({
          success: false,
          message : "password is incorrect !!"
        })
      }
      //checking the user email is verified or not 
      if (!user.isVerified) {
        return res.status(statuscode.BAD_REQUEST).json({
          success: false,
          message : "email is not verified pls verify first "
        })
      }
      const token = await jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email,
      }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
      // now the login user
      return res.status(statuscode.OK).json({
        success: true,
        message: "Login successfull",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },token : token
      })
    } catch (error) {
      console.log("hello",error)
      return res.status(statuscode.SERVER_ERROR).json({
        success: false,
        message : "Internal server "
      })
    }
  }
  //login to userDashboard
  async userDashboard(req, res) {
    try {
      return res.status(statuscode.BAD_REQUEST).json({
        success: true,
        message: "user login successfully",
        user : req.user
      })
      
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        success: false,
        message : "Internal server error"
      })
      
    }
  }
  //fetch user profile
  async profileFetch(req, res) {
    try {
      const id = req.user.id 
      const userProfile = await userModel.findById(id).select("-password -__v")
      if (!userProfile) {
        return res.status(statuscode.NOT_FOUND).json({
          success: false,
          message : "not found"
        })
      }
      return res.status(statuscode.OK).json({
        success: true,
        message: "profile fetched successfully",
        data : userProfile
      })
      
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        success: false,
        message : "internal server error"
      })
    }
  }
  //edit or update user profile
  async updateProfile(req, res) {
    try {
      const id = req.user.id
      const { name, email } = req.body
      const userdata = await userModel.findByIdAndUpdate(id, { name, email }, { new: true }).select("-password -__v")
      if (!userdata) {
        return res.status(statuscode.BAD_REQUEST).json({
          success: false,
          message : "user not found"
        })
      }
      return res.status(statuscode.OK).json({
        success: true,
        message: "user profile updated ",
        data : userdata
      })
    } catch (error) {
      return res.status(statuscode.SERVER_ERROR).json({
        success: false,
        message : "server error"
      })
    }
  }
}

module.exports = new userController();
