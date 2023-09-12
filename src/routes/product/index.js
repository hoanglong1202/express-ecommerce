const express = require("express");
const { authentication, apiKey, permission } = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../helpers/asyncHandler.helpers");
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.use(apiKey);
router.use(permission("0000"));
router.use(authentication);

router.post("", asyncHandler(productController.createProduct));
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));
router.post("/unpublish/:id", asyncHandler(productController.unPublishProductByShop));

router.get("/draft/all", asyncHandler(productController.findAllDraftForShop));
router.get("/publish/all", asyncHandler(productController.findAllPublishForShop));

module.exports = router;
