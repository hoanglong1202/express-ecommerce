const { Ok } = require("../core/success.response");
const commentService = require("../services/comment.service");

class CommentController {
  comment = async (req, res, next) => {
    req.body.userId = req.user.userId;
    const result = await commentService.createComment(req.body);

    new Ok({
      data: result,
    }).send(res);
  };

  getComment = async (req, res, next) => {
    const result = await commentService.getCommentByParentId(req.query);

    new Ok({
      data: result,
    }).send(res);
  };

  deleteComment = async (req, res, next) => {
    const result = await commentService.deleteCommentById(req.query);

    new Ok({
      data: "delete oke",
    }).send(res);
  };
}

module.exports = new CommentController();
