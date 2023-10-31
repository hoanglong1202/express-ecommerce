const express = require("express");
const { authentication, apiKey, permission } = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../helpers/asyncHandler.helpers");
const checkoutController = require("../../controllers/checkout.controller");
const router = express.Router();

router.use(apiKey);
router.use(permission("0000"));
router.use(authentication);

router.post("/review", asyncHandler(checkoutController.checkoutReview));

module.exports = router;
