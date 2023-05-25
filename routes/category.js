const express = require("express");
const router = express.Router();

// controllers
const {
  create,
  categories,
  removeCategory,
  updateCategory,
  postsByCategory,
} = require("../controllers/category");
const { requireSignin, isAdmin } = require("../middlewares");

router.post("/category", requireSignin, isAdmin, create);
router.get("/categories", categories);
router.delete("/category/:slug", requireSignin, isAdmin, removeCategory);
router.put("/category/:slug", requireSignin, isAdmin, updateCategory);
router.get("/posts-by-category/:slug", postsByCategory);

module.exports = router;
