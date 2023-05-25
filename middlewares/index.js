const User = require("../models/user");
const Media = require("../models/media");
const Post = require("../models/post");
const expressJwt = require("express-jwt");
require("dotenv").config();

// req.user = _id
const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "Admin") {
      return res.status(403).send("Unauhorized");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

const isAuthor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "Author") {
      return res.status(403).send("Unauhorized");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

const canCreateRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    switch (user.role) {
      case "Admin":
        next();
        break;
      case "Author":
        next();
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

const canUpdateDeletePost = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await Post.findById(req.params.postId);
    switch (user.role) {
      case "Admin":
        next();
        break;
      case "Author":
        if (post.postedBy.toString() !== user._id.toString()) {
          return res.status(403).send("Unauhorized");
        } else {
          next();
        }
        break;
      default:
        return res.status(403).send("Unauhorized");
    }
  } catch (err) {
    console.log(err);
  }
};

const canDeleteMedia = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const media = await Media.findById(req.params.id);
    switch (user.role) {
      case "Admin":
        next();
        break;
      case "Author":
        if (media.postedBy.toString() !== req.user._id.toString()) {
          return res.status(403).send("Unauhorized");
        } else {
          next();
        }
        break;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  isAdmin,
  requireSignin,
  isAuthor,
  canCreateRead,
  canDeleteMedia,
  canUpdateDeletePost,
};
