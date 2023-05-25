const express = require("express");
const {
  signup,
  signin,
  currentUser,
  createUser,
  users,
  deleteUser,
  getUser,
  updateUser,
  updateUserByAdmin,
  currentUserProfile,
  updateUserByUser,
} = require("../controllers/auth");
const { isAdmin, requireSignin, isAuthor } = require("../middlewares/index");
const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    data: "hello world from kaloraat auth API",
  });
});
router.post("/signup", signup);
router.post("/signin", signin);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);
router.get("/current-admin", requireSignin, isAdmin, currentUser);
router.get("/current-author", requireSignin, isAuthor, currentUser);
router.get("/current-subscriber", requireSignin, currentUser);

// create-user
router.post("/create-user", requireSignin, isAdmin, createUser);

router.get("/users", requireSignin, isAdmin, users);
router.delete("/user/:userId", requireSignin, isAdmin, deleteUser);

// updatation
router.get("/user/:userId", requireSignin, getUser);
router.get("/user/:userId", requireSignin, currentUserProfile);


router.put("/update-user-by-user", requireSignin, updateUserByUser);
router.put("/update-user-by-admin", requireSignin, isAdmin, updateUserByAdmin);

module.exports = router;
