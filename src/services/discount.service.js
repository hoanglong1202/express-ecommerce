"use-strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { convertToObjectIdMongoDb } = require("../utils");
const { findAllDiscountCodeUnselect, findDiscount } = require("./repositories/discount.repo");
const discount = require("../models/discount.model");
const { findAllProducts } = require("./repositories/product.repo");

class DiscountService {
  static async createDiscount({
    discount_name,
    discount_description,
    discount_value,
    discount_code,
    discount_start_date,
    discount_end_date,
    discount_max_uses,
    discount_users_count,
    discount_users_used,
    discount_max_uses_per_uses,
    discount_min_order_value,
    discount_shop,
    discount_type,
    discount_is_active,
    discount_apply_to,
    discount_products,
  }) {
    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestError("Invalid Date Range");
    }

    const foundDiscount = await findDiscount({ discount_code, discount_shop, model: discount });

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount not valid");
    }

    const result = await discount.create({
      discount_name,
      discount_description,
      discount_value,
      discount_code,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_max_uses,
      discount_users_count,
      discount_users_used,
      discount_max_uses_per_uses,
      discount_min_order_value: discount_min_order_value || 0,
      discount_shop,
      discount_is_active,
      discount_apply_to,
      discount_type,
      discount_products: discount_apply_to === "all" ? [] : discount_products,
    });

    return result;
  }

  // async updateDiscount() {}

  static async getAllDiscountCodeWithProduct({ discount_code, discount_shop, limit, page }) {
    const foundDiscount = await findDiscount({ discount_code, discount_shop, model: discount });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exist");
    }

    const query = {
      limit: +limit || 50,
      page: +page || 1,
      sort: "ctime",
      select: ["product_name", "_id"],
    };

    if (foundDiscount.discount_apply_to === "all") {
      query.filter = {
        product_shop: convertToObjectIdMongoDb(discount_shop),
        isPublished: true,
      };
    }

    if (foundDiscount.discount_apply_to === "specific") {
      query.filter = {
        _id: { $in: foundDiscount.discount_products },
        isPublished: true,
      };
    }

    const result = await findAllProducts(query);

    return result;
  }

  static async getAllDiscountByShop({ discount_shop, limit, page }) {
    const query = {
      filter: {
        discount_shop: convertToObjectIdMongoDb(discount_shop),
        discount_is_active: true,
      },
      limit: +limit || 50,
      page: +page || 1,
      sort: "ctime",
      unselect: ["__v"],
      model: discount,
    };
    console.log("AAAAAAAAAAA")
    const result = await findAllDiscountCodeUnselect(query);

    return result;
  }

  static async getDiscountAmount({ discount_code, discount_shop, user_id, products }) {
    const foundDiscount = await findDiscount({ discount_code, discount_shop, model: discount });
    if (!foundDiscount) {
      throw new NotFoundError("Discount not exist");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_uses,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new BadRequestError("Discount is inactive");
    }

    if (!discount_max_uses) {
      throw new BadRequestError("Discount is out of number!");
    }

    const totalOrder = products.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    if (discount_min_order_value > 0 && totalOrder < discount_min_order_value) {
      throw new BadRequestError("Discount require a minimum of value: " + discount_min_order_value);
    }

    if (discount_max_uses_per_uses) {
      const userCount = discount_users_used.find((x) => x === user_id);

      if (userCount >= discount_max_uses_per_uses) {
        throw new BadRequestError("Discount is reach the maximum use");
      }
    }

    const amount = discount_type === "fixed_amount" ? discount_value : Math.round(totalOrder * (discount_value / 100));

    return {
      totalOrder,
      amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscount({ discount_code, discount_shop, user_id }) {
    const result = await discount.findOneAndDelete({
      discount_shop: convertToObjectIdMongoDb(discount_shop),
      discount_code,
    });

    return result;
  }

  static async cancelDiscount({ discount_code, discount_shop }) {
    const foundDiscount = await findDiscount({ discount_code, discount_shop, model: discount });

    if (!foundDiscount) {
      throw new NotFoundError("Discount not exist");
    }

    const result = await discount.findOneAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: user_id,
      },
      $inc: {
        discount_max_uses: +1,
        discount_users_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
