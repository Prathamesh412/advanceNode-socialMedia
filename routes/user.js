const express = require("express");
const {
  getUserController,
  updateUserController,
  followUserController,
  unfollowUserController,
  blockUserController,
  unblockUserController,
  getBlockedUsersController,
  deleteUserController, searchUserController,uploadProfilePicController,uploadCoverPictureController
} = require("../controllers/user.controller");
const upload = require("../middlewares/uploads");

const router = express.Router();

//GET USER
router.get("/:userId", getUserController);

//UPDATE USER
router.put("/update/:userId", updateUserController);

//FOLLOW USER
router.post("/follow/:userId", followUserController);

//UNFOLLOW USER
router.post("/unfollow/:userId", unfollowUserController);

router.post("/block/:userId", blockUserController);

router.post("/unblock/:userId", unblockUserController);

router.get("/blocked/:userId",getBlockedUsersController);

router.delete("/delete/:userId", deleteUserController)

router.get("/search/:query", searchUserController)

// Upload Profile Pic
router.put("/update-profile-pic/:userId", upload.single("profilePicture"), uploadProfilePicController)

router.put("/update-cover-pic/:userId", upload.single("coverPicture"), uploadCoverPictureController)

module.exports = router;
