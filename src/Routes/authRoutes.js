const express = require("express");
const { googleLogin, logout, refreshAuthToken } = require("../Controller/authController");
const protection=require("../Middlewares/protection.js");

const router=express.Router();

router.post("/google",googleLogin);
router.post("/logout",protection, logout);
router.post("/refresh-token", protection, refreshAuthToken);

module.exports=router;