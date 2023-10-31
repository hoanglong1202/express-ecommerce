"use-strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const product = require("../models/product.model");
const { convertToObjectIdMongoDb } = require("../utils");
const { findAllProducts, findProduct } = require("./repositories/product.repo");

class CartService {
  static async createUserCart({ userId, product }) {
    const convertedUserId = convertToObjectIdMongoDb(userId);

    if (!convertedUserId) {
      throw new Error("Invalid userId");
    }

    const query = {
      cart_userId: convertedUserId,
      cart_state: "active",
    };
    const updateSet = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    const result = await cart.findOneAndUpdate(query, updateSet, options);
    return result;
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;

    const convertedUserId = convertToObjectIdMongoDb(userId);

    if (!convertedUserId) {
      throw new Error("Invalid userId");
    }

    const query = {
      cart_userId: convertedUserId,
      "cart_products.productId": productId,
      cart_state: "active",
    };
    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    const result = await cart.findOneAndUpdate(query, updateSet, options);
    return result;
  }

  static async addToCart({ userId, product }) {
    const { productId, quantity_old, quantity, shopId } = product;

    const foundProduct = await findProduct({ product_id: productId });

    if (!foundProduct || foundProduct.product_shop.toString() !== shopId) {
      throw new NotFoundError("Product not exist");
    }

    const convert_quantity_old = quantity_old || 0;
    const data = {
      productId,
      quantity: quantity - convert_quantity_old,
    };

    const foundCart = await cart.findOne({
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    });
    if (!foundCart && quantity >= 0) {
      return await CartService.createUserCart({ userId, product: data });
    }

    if (foundCart && quantity === 0) {
      return await CartService.deleteUserCart({ userId, productId });
    }

    const result = await CartService.updateUserCartQuantity({ userId, product: data });
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
