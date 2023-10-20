"use-strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const product = require("../models/product.model");
const { findAllProducts, findProduct } = require("./repositories/product.repo");

class CartService {
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    };
    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };
    const option = {
      upsert: true,
      new: true,
    };

    return await cart.findOneAndUpdate(query, updateSet, option);
  }

  static async addToCart({ userId, product }) {
    const { productId, quantity_old, quantity, shopId } = product;

    const foundProduct = await findProduct({ product_id: productId });
    if (!foundProduct || foundProduct.product_shop !== shopId) {
      throw new NotFoundError("Product not exist");
    }

    const data = {
      productId,
      quantity: quantity - quantity_old,
    };

    const result = await updateUserCartQuantity({ userId, data });
    return result;
  }

  static async deleteUserCart({ userId, productId }) {
    const query = {
      cart_userId: userId,
    };

    const foundCart = await cart.findOne(query);
    if (!foundCart) {
      throw new NotFoundError("Cart not exist");
    }

    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };

    const result = await cart.updateOne(query, updateSet);

    return result;
  }

  static async getUserCart({ userId }) {
    const query = {
      cart_userId: userId,
    };
    const result = await cart.findOne(query).lean();

    return result;
  }
}

module.exports = CartService;
