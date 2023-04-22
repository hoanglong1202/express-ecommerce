const express = require("express");
const authController = require("../../controllers/auth.controller");
const router = express.Router();

router.use("/shop/signup", authController.signUp);

module.exports = router;
