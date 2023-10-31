const { BadRequestError } = require("../core/error.response");
const { Created, Ok } = require("../core/success.response");
const CartService = require("../services/cart.service");

class ProductController {
  addToCart = async (req, res, next) => {
    const result = await CartService.addToCart({
      product: req.body.product,
      userId: req.user.userId,
    });
  
    if (!result) {
      throw new BadRequestError(`Can't add to cart`);
    }

    return new Created({
      data: result,
    }).send(res);
  };

  delete = async (req, res, next) => {
    const result = await CartService.deleteUserCart({
      productId: req.params.id,
      userId: req.user.userId,
    });

    return new Ok({
      data: result,
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    const result = await CartService.getUserCart({
      userId: req.user.userId,
    });

    return new Ok({
      data: result,
    }).send(res);
  };
}

module.exports = new ProductController();
