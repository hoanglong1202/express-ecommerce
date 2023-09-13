const express = require("express");
const { authentication, apiKey, permission } = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../helpers/asyncHandler.helpers");
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct));
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:id", asyncHandler(productController.findProduct));

router.use(apiKey);
router.use(permission("0000"));
router.use(authentication);

router.post("", asyncHandler(productController.createProduct));
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));
router.post("/unpublish/:id", asyncHandler(productController.unPublishProductByShop));

router.get("/draft/all", asyncHandler(productController.getAllDraftProductForShop));
router.get("/publish/all", asyncHandler(productController.getAllPublishProductForShop));

module.exports = router;
