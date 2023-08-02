const express = require("express");
const accessController = require("../../controllers/access.controller");
const { apiKey, permission, authentication } = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../helpers/asyncHandler.helpers");
const router = express.Router();

// check api key
router.use(apiKey);
// check permission
router.use(permission("0000"));

// routes
router.post("/shop/login", asyncHandler(accessController.login));
router.post("/shop/signup", asyncHandler(accessController.signUp));

router.use(authentication);

router.post("/shop/logout", asyncHandler(accessController.logout));

module.exports = router;
