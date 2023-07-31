const express = require("express");
const shopController = require("../../controllers/access.controller");
const router = express.Router();

router.post("/shop/signup", shopController.signUp);

module.exports = router;
