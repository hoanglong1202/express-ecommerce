const { BadRequestError } = require("../core/error.response");
const { Created } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    const result = await ProductService.createProduct(req.body.product_type, {
      ...req.body,
      product_shop: req.user.userId,
    });

    if (!result) {
      throw new BadRequestError(`Can't create product`);
    }

    return new Created({
      data: result,
    }).send(res);
  };
}

module.exports = new ProductController();
