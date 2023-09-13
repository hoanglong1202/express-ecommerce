const { BadRequestError } = require("../core/error.response");
const { Created, Ok } = require("../core/success.response");
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

  /**
   * @description Get all draft product
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */

  getAllDraftProductForShop = async (req, res, next) => {
    const result = await ProductService.getAllDraftProductForShop({
      product_shop: req.user.userId,
    });

    return new Ok({
      data: result,
    }).send(res);
  };

  getAllPublishProductForShop = async (req, res, next) => {
    const result = await ProductService.getAllPublishProductForShop({
      product_shop: req.user.userId,
    });

    return new Ok({
      data: result,
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    const result = await ProductService.publishProductByShop({
      product_shop: req.user.userId,
      product_id: req.params.id,
    });

    return new Ok({
      data: result,
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    const result = await ProductService.unPublishProductByShop({
      product_shop: req.user.userId,
      product_id: req.params.id,
    });

    return new Ok({
      data: result,
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    const result = await ProductService.getListSearchProduct({
      keySearch: req.params.keySearch,
    });

    return new Ok({
      data: result,
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    const result = await ProductService.findAllProducts(req.query);

    return new Ok({
      data: result,
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    const result = await ProductService.findProduct({
      product_id: req.params.id,
    });

    return new Ok({
      data: result,
    }).send(res);
  };
}

module.exports = new ProductController();
