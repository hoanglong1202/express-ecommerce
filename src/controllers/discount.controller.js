const { BadRequestError } = require("../core/error.response");
const { Created, Ok } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class ProductController {
  createDiscount = async (req, res, next) => {
    const result = await DiscountService.createDiscount({
      ...req.body,
      discount_shop: req.user.userId,
    });

    if (!result) {
      throw new BadRequestError(`Can't create product`);
    }

    return new Created({
      data: result,
    }).send(res);
  };

  /**
   * @description Get all draft product
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */

  getAllDiscountCodeWithProduct = async (req, res, next) => {
    const result = await DiscountService.getAllDiscountCodeWithProduct({
      ...req.query,
    });

    return new Ok({
      data: result,
    }).send(res);
  };

  getAllDiscountByShop = async (req, res, next) => {
    const result = await DiscountService.getAllDiscountByShop({
      ...req.query,
    });

    return new Ok({
      data: result,
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    const result = await DiscountService.getDiscountAmount({
      ...req.body,
    });

    return new Ok({
      data: result,
    }).send(res);
  };
}

module.exports = new ProductController();
