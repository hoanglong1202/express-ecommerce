"use-strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const product = require("../models/product.model");
const { convertToObjectIdMongoDb } = require("../utils");
const { getDiscountAmount } = require("./discount.service");
const { findCartById } = require("./repositories/cart.repo");
const { findAllProducts, findProduct, checkProductByServer } = require("./repositories/product.repo");

class CheckoutService {
  static async checkoutReview({ userId, cartId, shop_order }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw NotFoundError("Not found Cart");

    const checkout_order = {
      totalPrice: 0, // tổng giá gốc
      feeShip: 0, // tiền vận chuyển
      totalDiscount: 0, // tổng giám giá
      totalCheckout: 0, // tổng thanh toán = tổng giá gốc - tổng giám giá
    };

    const shop_order_new = [];
    for (let index = 0; index < shop_order.length; index++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order[index];

      const checkProductServer = await checkProductByServer({ products: item_products });
        console.log(checkProductServer)
      if (checkProductServer.find((x) => !x)) throw new BadRequestError("Wrong order");
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        item_products,
        priceRaw: checkoutPrice, // tiền gốc
        priceApplyDiscount: checkoutPrice, // tiền được áp dụng discount
      };

      if (shop_discounts.length > 0) {
        for (let index = 0; index < shop_discounts.length; index++) {
          const { codeId } = shop_discounts[index];

          const { amount = 0 } = await getDiscountAmount({
            discount_code: codeId,
            discount_shop: shopId,
            user_id: userId,
            products: checkProductServer,
          });
          checkout_order.totalDiscount += amount;

          if (amount > 0) {
            itemCheckout.priceApplyDiscount = checkoutPrice - amount;
          }
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_new.push(itemCheckout);
    }

    return {
      shop_order,
      shop_order_new,
      checkout_order,
    };
  }
}

module.exports = CheckoutService;
