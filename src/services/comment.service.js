const { BadRequestError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const { convertToObjectIdMongoDb } = require("../utils");
const { findProduct } = require("./repositories/product.repo");

class CommentService {
  static async createComment({ productId, userId, content, parentCommentId = null }) {
    const comment = new commentModel({
      comment_productId: convertToObjectIdMongoDb(productId),
      comment_userId: convertToObjectIdMongoDb(userId),
      comment_content: content,
      comment_parentId: convertToObjectIdMongoDb(parentCommentId),
    });

    let rightValue = 1;

    if (parentCommentId) {
      const parent = await commentModel.findOne({
        _id: convertToObjectIdMongoDb(parentCommentId),
      });

      if (!parent) throw new BadRequestError();
      rightValue = parent.comment_right;

      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongoDb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongoDb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const mostRightValue = await commentModel.findOne(
        {
          comment_productId: convertToObjectIdMongoDb(productId),
        },
        "comment_right",
        {
          sort: {
            comment_right: -1,
          },
        }
      );

      if (mostRightValue) {
        rightValue = mostRightValue + 1;
      }
    }

    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    const result = await comment.save();

    return result;
  }

  static async getCommentByParentId({ productId, parentCommentId = null }) {
    const parent = await commentModel.findOne({
      comment_productId: convertToObjectIdMongoDb(productId),
      comment_parentId: parentCommentId,
    });

    if (!parentCommentId && parent) {
      return parent;
    }

    if (!parent) {
      throw new BadRequestError();
    }

    const result = await commentModel.find({
      comment_productId: convertToObjectIdMongoDb(productId),
      comment_left: { $gt: parent.comment_left },
      comment_right: { $lt: parent.comment_right },
    });

    return result;
  }

  static async deleteCommentById({ productId, commentId = null }) {
    const product = await findProduct({ product_id: productId });

    if (!product) {
      throw new BadRequestError();
    }

    const comment = await commentModel.findOne({
      _id: convertToObjectIdMongoDb(commentId),
      comment_productId: product._id,
    });

    if (!comment) {
      throw new BadRequestError();
    }

    const left = comment.comment_left;
    const right = comment.comment_right;
    const width = right - left + 1;

    await commentModel.deleteMany({
      comment_productId: product._id,
      comment_left: {
        $gte: left,
      },
      comment_right: {
        $lte: right,
      },
    });

    await commentModel.updateMany(
      {
        comment_productId: product._id,
        comment_left: { $gt: right },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    );

    await commentModel.updateMany(
      {
        comment_productId: product._id,
        comment_right: { $gt: right },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    );
  }
}

module.exports = CommentService;
