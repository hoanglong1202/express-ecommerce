const { BadRequestError } = require("../core/error.response");
const { Created, Ok } = require("../core/success.response");
const CartService = require("../services/cart.service");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    const result = await CheckoutService.checkoutReview({
      cartId: req.body.cartId,
      shop_order: req.body.shop_order,
      userId: req.user.userId,
    });
  
    if (!result) {
      throw new BadRequestError(`Can't checkout`);
    }

    return new Ok({
      data: result,
    }).send(res);
  };
}

module.exports = new CheckoutController();
