const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    role: {
      type: String,
      default: "Subscriber",
    },
    image: { type: ObjectId, ref: "Media" },

    resetCode: "",
    posts: [{ type: ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
