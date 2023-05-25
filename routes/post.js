const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");

// middleware
const {
  requireSignin,
  isAdmin,
  canCreateRead,
  canDeleteMedia,
  canUpdateDeletePost,
} = require("../middlewares");
// controllers
const {
  uploadImage,
  createPost,
  posts,
  uploadImageFile,
  removeMedia,
  media,
  singlePost,
  removePost,
  editPost,
  postsByAuthor,
  postsPage,
  postCount,
  getNumbers,
} = require("../controllers/post");

router.post("/upload-image", requireSignin, canCreateRead, uploadImage);
router.post(
  "/upload-image-file",
  formidable(),
  requireSignin,
  canCreateRead,
  uploadImageFile
);
router.post("/create-post", requireSignin, canCreateRead, createPost);
router.get("/posts", posts);
router.get("/posts/:page", postsPage);
router.get("/post-count", postCount);
router.get("/post/:slug", singlePost);
router.delete("/post/:postId", requireSignin, canUpdateDeletePost, removePost);
router.put("/edit-post/:postId", requireSignin, canUpdateDeletePost, editPost);
router.get("/posts-by-author", requireSignin, postsByAuthor);

// media
router.get("/media", requireSignin, canCreateRead, media);
router.delete("/media/:id", requireSignin, canDeleteMedia, removeMedia);
router.get("/numbers", getNumbers);

module.exports = router;
