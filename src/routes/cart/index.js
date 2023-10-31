const express = require("express");
const { authentication, apiKey, permission } = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../helpers/asyncHandler.helpers");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();

router.use(apiKey);
router.use(permission("0000"));
router.use(authentication);

router.post("", asyncHandler(cartController.addToCart));
router.delete("/:id", asyncHandler(cartController.delete));
router.get("", asyncHandler(cartController.listToCart));

module.exports = router;
