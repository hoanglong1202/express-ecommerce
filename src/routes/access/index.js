const express = require("express");
const accessController = require("../../controllers/access.controller");
const { authentication, apiKey, permission } = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../helpers/asyncHandler.helpers");
const router = express.Router();

// routes
router.post("/shop/login", asyncHandler(accessController.login));
router.post("/shop/signup", asyncHandler(accessController.signUp));

router.use(apiKey);
router.use(permission("0000"));
router.use(authentication);

router.post("/shop/logout", asyncHandler(accessController.logout));
router.post("/shop/refresh", asyncHandler(accessController.handlerRefreshToken));

module.exports = router;
