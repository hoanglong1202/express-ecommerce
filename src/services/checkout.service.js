"use-strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const order = require("../models/order.model");
const product = require("../models/product.model");
const { convertToObjectIdMongoDb } = require("../utils");
const { getDiscountAmount } = require("./discount.service");
// const { acquireLock, releaseLock } = require("./redis.service");
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

  static async orderByUser({ userId, cartId, shop_order, user_address = {}, user_payment = {} }) {
    const { shop_order_new, checkout_order } = await CheckoutService.checkoutReview({ userId, cartId, shop_order });

    const products = shop_order_new.flatMap((order) => order.item_products);
    const acquireProduct = [];
    for (let index = 0; index < products.length; index++) {
      const { productId, quantity } = products[index];

      // const keyLock = await acquireLock({ product_id: productId, quantity, cart_id: cartId });
      acquireProduct.push(keyLock ? true : false);

      // if (keyLock) {
      //   await releaseLock(keyLock)
      // }
    }

    if(acquireProduct.includes(false)) {
      throw new BadRequestError("Some product has change, please update your cart!!")
    }

    const newOrder = await order.create({
      order_user_id: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_product: shop_order_new,

    });
    return newOrder
  }
}

module.exports = CheckoutService;
