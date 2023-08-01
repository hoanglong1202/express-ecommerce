const express = require("express");
const shopController = require("../../controllers/access.controller");
const asyncHandler = require("../../middlewares/asyncHandler.middleware");
const router = express.Router();

router.post("/shop/signup", asyncHandler(shopController.signUp));

module.exports = router;
