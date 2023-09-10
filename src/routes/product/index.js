const express = require("express");
const { authentication } = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../helpers/asyncHandler.helpers");
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.use(authentication);

router.post("", asyncHandler(productController.createProduct));

module.exports = router;
