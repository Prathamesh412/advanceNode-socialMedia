const Comment = require("../models/comment.model");
const Post = require("../models/Post.model");
const Story = require("../models/story.model");
const User = require("../models/User.model");

const getUserController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ message: "User does not exist" });
    }

    const { password, ...data } = user._doc;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateUserController = async (req, res, next) => {
  const { userId } = req.params;
  const updateData = req.body;
  try {
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      res.status(400).json("User not found");
    }

    Object.assign(userToUpdate, updateData);

    await userToUpdate.save();

    res
      .status(200)
      .json({ message: "User updated successfully!", user: userToUpdate });
  } catch (error) {
    res.status(500).json(error);
  }
};

const followUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id) {
      res.status(400).json("You can't follow yourself");
    }

    const userToFollow = await User.findById(userId);
    const loggedInUser = await User.findById(_id);

    if (!userToFollow || !loggedInUser) {
      res.status(400).json("User not found");
    }

    if (loggedInUser.following.includes(userId)) {
      res.status(400).json("Already following User");
    }

    loggedInUser.following.push(userId);
    userToFollow.followers.push(_id);

    await loggedInUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "Successfully followed user!" });
  } catch (error) {
    next(error);
  }
};

const unfollowUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id) {
      res.status(400).json("You can't unfollow yourself");
    }

    const userToUnfollow = await User.findById(userId);
    const loggedInUser = await User.findById(_id);

    if (!userToUnfollow || !loggedInUser) {
      res.status(400).json("User not found");
    }

    if (!loggedInUser.following.includes(userId)) {
      res.status(400).json("Already not following User");
    }

    loggedInUser.following = loggedInUser.following.filter(
      (id) => id.toString() !== userId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== _id
    );

    await loggedInUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: "Successfully unfollowed user!" });
  } catch (error) {
    next(error);
  }
};

const blockUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;
  try {
    if (userId === _id) {
      res.status(400).json("You can't block yourself");
    }

    const userToBlock = await User.findById(userId);
    const loggedInUser = await User.findById(_id);

    if (!userToBlock || !loggedInUser) {
      res.status(400).json("User not found");
    }

    if (loggedInUser.blockList.includes(userId)) {
      res.status(400).json("Already blocked User");
    }

    loggedInUser.blockList.push(userId);

    loggedInUser.following = loggedInUser.following.filter(
      (id) => id.toString() !== userId
    );
    userToBlock.followers = userToBlock.followers.filter(
      (id) => id.toString() !== _id
    );

    await loggedInUser.save();
    await userToBlock.save();

    res.status(200).json({ message: "Successfully blocked user!" });
  } catch (error) {
    next(error);
  }
};

const unblockUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;
  try {
    if (userId === _id) {
      res.status(400).json("You can't unblock yourself");
    }

    const userToUnblock = await User.findById(userId);
    const loggedInUser = await User.findById(_id);

    if (!userToUnblock || !loggedInUser) {
      res.status(400).json("User not found");
    }

    if (!loggedInUser.blockList.includes(userId)) {
      res.status(400).json("Already unblocked User");
    }

    loggedInUser.blockList = loggedInUser.blockList.filter(
      (id) => id.toString() != userId
    );

    await loggedInUser.save();

    res.status(200).json({ message: "Successfully unblocked user!" });
  } catch (error) {
    next(error);
  }
};

const getBlockedUsersController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate(
      "blockList",
      "username fullName profilePicture"
    );
    if (!user) {
      res.status(400).json("User Not found");
    }

    const { blockList, ...data } = user;

    res.status(200).json(blockList);
  } catch (error) {
    next(error);
  }
};

const deleteUserController = async (req, res, next) => {};

const searchUserController = async (req, res, next) => {
  const queryParams = req.params.query;
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: new RegExp(queryParams, "i") } },
        { fullName: { $regex: new RegExp(queryParams, "i") } },
      ],
    });

    if (!users) {
      res.status(400).json("User Not found");
    }
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

const generateFileUrl=(filename)=>{
    return `http://localhost:3000`+`/uploads/${filename}`
}

const uploadProfilePicController = async(req,res,next)=>{
    const {userId}=req.params
    const {filename}=req.file
    try{
        const user=await User.findByIdAndUpdate(userId,{profilePicture:generateFileUrl(filename)},{new:true})
        if(!user){
            throw new CustomError("User not found!",404)
        }

        res.status(200).json({message:"Profile picture updated successfully!",user})

    }
    catch(error){
        console.log(error)
    }
}

const uploadCoverPictureController=async(req,res,next)=>{
    const {userId}=req.params
    const {filename}=req.file
    try{
        const user=await User.findByIdAndUpdate(userId,{coverPicture:generateFileUrl(filename)},{new:true})
        if(!user){
            throw new CustomError("User not found!",404)
        }

        res.status(200).json({message:"Cover picture updated successfully!",user})

    }
    catch(error){
        next(error)
    }
}

module.exports = {
  getUserController,
  updateUserController,
  followUserController,
  unfollowUserController,
  blockUserController,
  unblockUserController,
  getBlockedUsersController,
  deleteUserController,
  searchUserController,
  uploadProfilePicController,
  uploadCoverPictureController
};
