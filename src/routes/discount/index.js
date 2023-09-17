const express = require("express");
const { authentication, apiKey, permission } = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../helpers/asyncHandler.helpers");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get("/list-product-code", asyncHandler(discountController.getAllDiscountCodeWithProduct));

router.use(apiKey);
router.use(permission("0000"));
router.use(authentication);

router.post("", asyncHandler(discountController.createDiscount));
router.get("", asyncHandler(discountController.getAllDiscountByShop));

module.exports = router;
