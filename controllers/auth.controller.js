const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    // const newUser = new User({
    //     username: "John",
    //     email:"John@gmail.com",
    //     password: "123456",
    //     fullName: "John Doe",
    //     bio: "Hey there"
    // })
    console.log(req.body);

    const { username, email, password, fullName, bio } = req.body;

    const existingUser = User.findOne({ email: email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const newUser = new User({ ...req.body, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

const loginController = async (req, res) => {
  try {
    let user;
    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
    } else {
      user = await User.findOne({ username: req.body.username });
    }

    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      throw new CustomError("Wrong Credentials!", 401);
    }

    const { password, ...data } = user._doc;
    const token = jwt.sign({ _id: user._id }, "JackInTheBox", {
      expiresIn: "3d",
    });
    res.cookie("token", token).status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

const logoutController = (req, res) => {
  try {
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .json("user logged out successfully!");
  } catch (error) {
    res.status(500).json(error);
  }
};

const refetchUserController = async (req, res, next) => {
  const token = req.cookies.token;
  jwt.verify(token, "JackInTheBox", {}, async (err, data) => {
    if (err) {
      res.status(400).json(err);
    }
    try {
      const id = data._id;
      const user = await User.findOne({ _id: id });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  });
};

module.exports={registerController,loginController,
    logoutController,refetchUserController}
