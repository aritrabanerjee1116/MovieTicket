const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "profile.img",
    },
  },
  { timestamps: true },
);
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
