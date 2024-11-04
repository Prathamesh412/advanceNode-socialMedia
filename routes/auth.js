const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerController,loginController,logoutController,refetchUserController } = require("../controllers/auth.controller");

router.post("/register", registerController )
router.post("/login",loginController)

router.get('/logout',logoutController)

router.get('/refetchUser',refetchUserController)

module.exports = router;
