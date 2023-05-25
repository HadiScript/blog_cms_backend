const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {},
    featuredImage: { type: ObjectId, ref: "Media" },
    categories: [{ type: ObjectId, ref: "Category" }],
    published: { type: Boolean, default: true },
    postedBy: { type: ObjectId, ref: "User" },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
