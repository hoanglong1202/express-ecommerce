const express = require("express");
const { authentication, apiKey, permission } = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../helpers/asyncHandler.helpers");
const commentController = require("../../controllers/comment.controller");
const router = express.Router();

router.use(apiKey);
router.use(permission("0000"));
router.use(authentication);

router.get("/", asyncHandler(commentController.getComment));
router.delete("/", asyncHandler(commentController.deleteComment));
router.post("", asyncHandler(commentController.comment));

module.exports = router;
